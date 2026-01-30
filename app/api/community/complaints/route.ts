import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const complaints = await db.complaint.findMany({
            where: {
                userId: (session.user as any).id
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(complaints);
    } catch (error) {
        console.error("[COMPLAINTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const { category, content, isAnonymous } = await req.json();

        const complaint = await db.complaint.create({
            data: {
                userId: (session.user as any).id,
                category,
                content,
                isAnonymous,
                status: "PENDING",
            }
        });

        return NextResponse.json(complaint);
    } catch (error) {
        console.error("[COMPLAINTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
