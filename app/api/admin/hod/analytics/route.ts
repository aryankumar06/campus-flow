import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    // Strict Role Check for HOD or ADMIN
    if (!session?.user?.email || (session.user.role !== "HOD" && session.user.role !== "ADMIN")) {
        return NextResponse.json({ message: "Unauthorized Access" }, { status: 403 });
    }

    try {
        // 1. Fetch Top 5 Performers by CGPA
        const topPerformers = await db.user.findMany({
            where: { role: "STUDENT" },
            orderBy: { cgpa: 'desc' },
            take: 5,
            select: { id: true, name: true, cgpa: true, department: true, semester: true }
        });

        // 2. Calculate Average Attendance
        const students = await db.user.findMany({
            where: { role: "STUDENT" },
            select: { attendance: true }
        });

        const totalAttendance = students.reduce((acc: number, curr: any) => acc + (curr.attendance || 0), 0);
        const avgAttendance = students.length > 0 ? (totalAttendance / students.length).toFixed(1) : 0;

        // 3. Department Distribution
        const deptStats = await db.user.groupBy({
            by: ['department'],
            _count: {
                id: true,
            },
            where: { role: "STUDENT" }
        });

        return NextResponse.json({
            topPerformers,
            avgAttendance,
            deptStats,
            totalStudents: students.length
        });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch analytics", error }, { status: 500 });
    }
}
