import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { eventId } = body;

    if (!eventId) {
      return new NextResponse("Event ID required", { status: 400 });
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    if (event._count.registrations >= event.capacity) {
      return new NextResponse("Event is full", { status: 400 });
    }

    const existingRegistration = await db.registration.findUnique({
      where: {
        userId_eventId: {
                userId: (session.user as any).id,
                eventId: eventId,
              },
            },
          });

    if (existingRegistration) {
      return new NextResponse("Already registered", { status: 409 });
    }

    const registration = await db.registration.create({
      data: {
        userId: (session.user as any).id,
        eventId: eventId,
        qrCode: uuidv4(), // Generate unique QR token
      },
      include: {
        event: true,
        user: true,
      }
    });

    // Send confirmation email
    try {
        const { sendRegistrationEmail } = await import("@/lib/email");
        await sendRegistrationEmail(
            registration.user.email,
            registration.user.name,
            registration.event.title,
            registration.event.dateTime,
            registration.event.venue,
            registration.qrCode
        );
    } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue even if email fails
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error("[RSVP_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
