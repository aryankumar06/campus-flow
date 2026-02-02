import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const userId = (session.user as any).id;

        const [badges, credits] = await Promise.all([
            db.badge.findMany({
                where: { userId },
                orderBy: { earnedAt: "desc" }
            }),
            db.activityCredit.findMany({
                where: { userId }
            })
        ]);

        const stats = {
            attendancePoints: credits.filter((c: any) => c.type === "ATTENDANCE").reduce((acc: number, curr: any) => acc + curr.points, 0),
            organizingPoints: credits.filter((c: any) => c.type === "ORGANIZE").reduce((acc: number, curr: any) => acc + curr.points, 0),
            volunteerPoints: credits.filter((c: any) => c.type === "VOLUNTEER").reduce((acc: number, curr: any) => acc + curr.points, 0),
            totalPoints: credits.reduce((acc: number, curr: any) => acc + curr.points, 0),
            eventsAttended: credits.filter((c: any) => c.type === "ATTENDANCE").length,
            volunteerHours: 0
        };
        stats.volunteerHours = stats.volunteerPoints;

        return NextResponse.json({
            badges,
            stats
        });
    } catch (error) {
        console.error("[ACTIVITY_STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
