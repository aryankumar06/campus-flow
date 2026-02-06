import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import * as z from "zod";

const profileSchema = z.object({
    semester: z.string().optional(),
    batch: z.string().optional(),
    academicSession: z.string().optional(),
    collegeId: z.string().optional(),
    department: z.string().optional(),
});

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: {
            name: true,
            email: true,
            role: true,
            department: true,
            collegeId: true,
            semester: true,
            batch: true,
            academicSession: true,
            cgpa: true,
        },
    });

    return NextResponse.json(user);
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const data = profileSchema.parse(body);

        // Sanitize: Convert empty strings to null to avoid Unique constraint errors (e.g. collegeId="")
        const uniqueFields = ['collegeId'];
        const sanitizedDetails: any = { ...data };

        Object.keys(sanitizedDetails).forEach((key) => {
            if (sanitizedDetails[key] === "") {
                sanitizedDetails[key] = null;
            }
        });

        const updatedUser = await db.user.update({
            where: { email: session.user.email },
            data: {
                ...sanitizedDetails,
            },
        });

        return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        return NextResponse.json({ message: "Invalid data", error }, { status: 400 });
    }
}
