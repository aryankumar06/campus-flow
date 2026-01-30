import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const { fileUrl } = await req.json();

        const submission = await db.submission.create({
            data: {
                assignmentId: params.id,
                userId: (session.user as any).id,
                fileUrl,
            }
        });

        return NextResponse.json(submission);
    } catch (error) {
        console.error("[SUBMISSION_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
