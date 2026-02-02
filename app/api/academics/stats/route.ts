import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const user = await db.user.findUnique({
            where: { id: (session.user as any).id },
            select: { attendance: true }
        });

        const alerts = await db.alert.findMany({
            where: {
                target: { in: ["ALL", "STUDENT"] },
                date: { gte: new Date() } // Only future alerts
            },
            orderBy: { date: "asc" },
            take: 1
        });

        return NextResponse.json({
            attendance: user?.attendance || 0,
            alert: alerts[0] || null,
        });
    } catch (error) {
        console.error("[ACADEMICS_STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
