import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import * as z from "zod";

const assignSchema = z.object({
    subjectName: z.string(),
    subjectCode: z.string(),
    department: z.string(),
    targetSemester: z.string(),
    rangeStart: z.string(), // Roll Number Start (e.g. 2101001)
    rangeEnd: z.string(),   // Roll Number End (e.g. 2101060)
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    // Check access: Coordinator, HOD, or Admin
    if (!session?.user?.email || !["COORDINATOR", "HOD", "ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { subjectName, subjectCode, department, targetSemester, rangeStart, rangeEnd } = assignSchema.parse(body);

        // 1. Create or Find the Subject
        const subject = await db.subject.upsert({
            where: { code: subjectCode },
            update: { name: subjectName },
            create: {
                name: subjectName,
                code: subjectCode,
                department,
                semester: targetSemester,
            },
        });

        // 2. Find students in range
        // Note: Assuming collegeId is purely numeric for range comparison. If alphanumeric, logic needs adjustment.
        // For simplicity, we filter by department and try to match strings or fetch all and filter in memory if needed.
        // Prisma string comparison works for lexicographical order which is usually fine for fixed length roll IDs.

        // Using string comparison for College IDs
        const students = await db.user.findMany({
            where: {
                department: department,
                role: "STUDENT",
                collegeId: {
                    gte: rangeStart,
                    lte: rangeEnd
                }
            }
        });

        if (students.length === 0) {
            return NextResponse.json({ message: "No students found in this range." }, { status: 404 });
        }

        // 3. Assign Subject to Students (Bulk Insert)
        let assignedCount = 0;

        // Prisma doesn't support 'createMany' for relations easily with 'skipDuplicates', so we use a transaction or loop.
        // Loop is safer for ensuring existence.
        await db.$transaction(
            students.map(student =>
                db.studentSubject.upsert({
                    where: {
                        userId_subjectId: {
                            userId: student.id,
                            subjectId: subject.id
                        }
                    },
                    update: {}, // Do nothing if exists
                    create: {
                        userId: student.id,
                        subjectId: subject.id
                    }
                })
            )
        );

        assignedCount = students.length;

        return NextResponse.json({
            message: `Assigned '${subjectName}' to ${assignedCount} students.`,
            studentsCount: assignedCount
        });

    } catch (error) {
        console.error("Assignment Error:", error);
        return NextResponse.json({ message: "Failed to assign subjects", error }, { status: 500 });
    }
}
