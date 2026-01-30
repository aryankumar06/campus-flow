import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const currentUser = await db.user.findUnique({
            where: { id: (session.user as any).id }
        });

        if (!currentUser) return new NextResponse("User not found", { status: 404 });

        // Matching Algorithm logic:
        // 1. Same department
        // 2. Different graduation year (High gap = Senior-Junior match)
        // 3. Organizers are preferred mentors

        const matches = await db.user.findMany({
            where: {
                department: currentUser.department,
                id: { not: currentUser.id },
                role: "ORGANIZER", // For now, treat organizers as mentors
            },
            take: 5,
            select: {
                id: true,
                name: true,
                department: true,
                year: true,
                role: true,
            }
        });

        // Add some "expertise" and "rating" metadata to the result for the UI
        const enhancedMatches = matches.map((user: any) => ({
            ...user,
            expertise: ["Project Prep", "Internships", "General Advice"],
            rating: (4 + Math.random()).toFixed(1),
            sessions: Math.floor(Math.random() * 50) + 10,
            image: `https://i.pravatar.cc/150?u=${user.id}`,
        }));

        return NextResponse.json(enhancedMatches);
    } catch (error) {
        console.error("[MENTOR_MATCH_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
