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
    const {
      title,
      description,
      dateTime,
      venue,
      capacity,
      category,
      imageUrl,
      deadline,
    } = body;

    if (!title || !dateTime || !venue || !capacity || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const result = await db.$transaction(async (tx: any) => {
      const event = await tx.event.create({
        data: {
          title,
          description,
          dateTime: new Date(dateTime),
          venue,
          capacity: parseInt(capacity),
          category,
          imageUrl,
          deadline: deadline ? new Date(deadline) : null,
          organizerId: (session.user as any).id,
        },
      });

      await tx.activityCredit.create({
        data: {
          userId: (session.user as any).id,
          type: "ORGANIZE",
          points: 3,
          reason: `Organized: ${title}`,
        }
      });

      return event;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");

    const whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    const events = await db.event.findMany({
      where: whereClause,
      orderBy: {
        dateTime: "asc",
      },
      include: {
        organizer: {
          select: {
            name: true,
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[EVENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
