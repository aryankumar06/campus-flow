import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { userId, action } = await req.json(); // action: "APPROVE", "REJECT"

        if (action === "APPROVE") {
            await db.user.update({
                where: { id: userId },
                data: { isApproved: true }
            });
        } else if (action === "REJECT") {
            await db.user.delete({
                where: { id: userId }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_APPROVE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
