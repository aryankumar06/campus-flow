import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || (session.user as any).role !== "ORGANIZER") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const event = await db.event.findUnique({
            where: {
                id: params.id,
                organizerId: (session.user as any).id,
            },
            include: {
                registrations: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                department: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                _count: {
                    select: { registrations: true },
                },
            },
        });

        if (!event) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("[EVENT_MANAGE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
