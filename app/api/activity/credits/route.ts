import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const credits = await db.activityCredit.findMany({
            where: {
                userId: (session.user as any).id
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const totalPoints = credits.reduce((sum: number, c: any) => sum + c.points, 0);

        return NextResponse.json({
            credits,
            totalPoints
        });
    } catch (error) {
        console.error("[ACTIVITY_CREDITS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
