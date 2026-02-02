import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const [stats, pendingOrganizers] = await Promise.all([
            db.user.groupBy({
                by: ['role'],
                _count: { role: true },
            }),
            db.user.findMany({
                where: {
                    role: "ORGANIZER",
                    isApproved: false
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true
                }
            })
        ]);

        // Format stats for easier consumption
        const formattedStats = {
            totalUsers: stats.reduce((acc: number, curr: any) => acc + curr._count.role, 0),
            students: stats.find((s: any) => s.role === "STUDENT")?._count.role || 0,
            organizers: stats.find((s: any) => s.role === "ORGANIZER")?._count.role || 0,
            pending: pendingOrganizers.length
        };

        return NextResponse.json({
            stats: formattedStats,
            pendingOrganizers
        });
    } catch (error) {
        console.error("[ADMIN_DASHBOARD_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
