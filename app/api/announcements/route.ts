import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const announcements = await db.announcement.findMany({
            include: {
                club: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(announcements);
    } catch (error) {
        console.error("[ANNOUNCEMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ORGANIZER") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, content, tier, clubId } = await req.json();

        const announcement = await db.announcement.create({
            data: {
                title,
                content,
                tier,
                clubId,
            }
        });

        return NextResponse.json(announcement);
    } catch (error) {
        console.error("[ANNOUNCEMENTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
