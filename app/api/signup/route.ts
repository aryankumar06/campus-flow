import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import * as z from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "ORGANIZER"]).default("STUDENT"),
  collegeId: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Sanitize empty strings to null
    if (body.collegeId === "") body.collegeId = null;
    if (body.department === "") body.department = null;
    if (body.year === "") body.year = null;

    const { name, email, password, role, collegeId, department, year } = userSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
        isApproved: role === "ORGANIZER" ? false : true,
        collegeId,
        department,
        year,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    // Send welcome email
    try {
      const { sendWelcomeEmail } = await import("@/lib/email");
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP_POST]", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
