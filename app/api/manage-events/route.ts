import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !["CLUB_ADMIN", "HOD", "ADMIN", "ORGANIZER"].includes((session.user as any).role)) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const events = await db.event.findMany({
      where: {
        organizerId: (session.user as any).id,
      },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[MANAGE_EVENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
