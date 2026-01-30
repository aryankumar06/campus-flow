import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ORGANIZER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { eventId, qrCode } = body;

    if (!eventId || !qrCode) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if event belongs to organizer
    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.organizerId !== (session.user as any).id) {
      return new NextResponse("Unauthorized to manage this event", {
        status: 403,
      });
    }

    // Find registration
    const registration = await db.registration.findUnique({
      where: { qrCode },
      include: { user: true },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Invalid QR Code" },
        { status: 404 }
      );
    }

    if (registration.eventId !== eventId) {
      return NextResponse.json(
        { error: "Ticket is for a different event" },
        { status: 400 }
      );
    }

    if (registration.attended) {
      return NextResponse.json(
        { error: "Already marked as attended", studentName: registration.user.name },
        { status: 409 }
      );
    }

    // Mark attendance and award credits
    await db.$transaction([
      db.registration.update({
        where: { id: registration.id },
        data: { attended: true },
      }),
      db.activityCredit.create({
        data: {
          userId: registration.userId,
          type: "ATTENDANCE",
          points: 1,
          reason: `Attended: ${event.title}`,
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      studentName: registration.user.name,
    });
  } catch (error) {
    console.error("[ATTENDANCE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
