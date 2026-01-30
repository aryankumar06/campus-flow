import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

// This endpoint could be called by a CRON job (e.g., via Vercel Cron or GitHub Actions)
export async function POST(req: Request) {
    try {
        // Basic verification token to prevent spam
        const { auth_token } = await req.json();
        if (auth_token !== process.env.NEXTAUTH_SECRET) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find events happening in the next 24-48 hours
        const upcomingEvents = await db.event.findMany({
            where: {
                dateTime: {
                    gt: new Date(),
                    lt: tomorrow,
                },
            },
            include: {
                registrations: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        let sentCount = 0;

        for (const event of upcomingEvents) {
            for (const reg of event.registrations) {
                if (!reg.attended) {
                    await sendEmail({
                        to: reg.user.email,
                        subject: `Reminder: ${event.title} is tomorrow!`,
                        html: `
              <h1>Event Reminder</h1>
              <p>Hi ${reg.user.name},</p>
              <p>This is a friendly reminder that <strong>${event.title}</strong> is happening tomorrow at <strong>${event.venue}</strong>.</p>
              <p>Make sure to have your QR code ready for check-in!</p>
              <a href="${process.env.NEXTAUTH_URL}/my-events">View My Ticket</a>
            `,
                    });
                    sentCount++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Automated reminders sent to ${sentCount} students.`
        });
    } catch (error) {
        console.error("[REMINDERS_AUTO]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
