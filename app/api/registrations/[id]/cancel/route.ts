import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const registration = await db.registration.findUnique({
      where: { id: params.id },
      include: { event: true },
    });

    if (!registration) {
      return new NextResponse("Registration not found", { status: 404 });
    }

    if (registration.userId !== (session.user as any).id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const now = new Date();
    const eventDate = new Date(registration.event.dateTime);

    if (registration.attended) {
      return new NextResponse("Already attended", { status: 400 });
    }

    if ((registration as any).canceledAt) {
      return new NextResponse("Already canceled", { status: 409 });
    }

    if (eventDate <= now) {
      return new NextResponse("Event already started", { status: 400 });
    }

    const updated = await db.registration.update({
      where: { id: params.id },
      data: { canceledAt: now },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[REGISTRATION_CANCEL_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
