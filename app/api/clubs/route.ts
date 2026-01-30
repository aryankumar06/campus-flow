import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const clubs = await db.club.findMany({
            include: {
                _count: {
                    select: { members: true }
                }
            }
        });

        return NextResponse.json(clubs);
    } catch (error) {
        console.error("[CLUBS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ORGANIZER") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { name, description } = await req.json();

        const club = await db.club.create({
            data: {
                name,
                description,
                adminId: (session.user as any).id,
            }
        });

        return NextResponse.json(club);
    } catch (error) {
        console.error("[CLUBS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
