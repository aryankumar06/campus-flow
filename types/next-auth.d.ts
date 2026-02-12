import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "ORGANIZER" | "ADMIN" | "HOD" | "COORDINATOR" | "CLUB_ADMIN" | "FACULTY";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "STUDENT" | "ORGANIZER" | "ADMIN" | "HOD" | "COORDINATOR" | "CLUB_ADMIN" | "FACULTY";
  }
}
