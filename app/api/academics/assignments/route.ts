import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const userDepartment = (session.user as any).department || "";

        const assignments = await db.assignment.findMany({
            where: {
                department: userDepartment
            },
            include: {
                submissions: {
                    where: {
                        userId: (session.user as any).id
                    }
                }
            },
            orderBy: {
                dueDate: "asc"
            }
        });

        return NextResponse.json(assignments);
    } catch (error) {
        console.error("[ASSIGNMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
