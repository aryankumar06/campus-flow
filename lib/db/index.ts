import { createMockDb } from "./mock";

declare global {
  // eslint-disable-next-line no-var
  var prisma: any | undefined;
}

const getClient = (): any => {
  const dbUrl = process.env.DATABASE_URL;
  console.log("----------------------------------------------------------------");
  console.log("[DB] Initializing Database Client");
  console.log("[DB] NODE_ENV:", process.env.NODE_ENV);
  console.log("[DB] DATABASE_URL Defined:", !!dbUrl);
  if (dbUrl) console.log("[DB] DATABASE_URL Preview:", dbUrl.substring(0, 12) + "...");

  const hasDbUrl = !!dbUrl && !dbUrl.includes("user:password@localhost");

  if (hasDbUrl) {
    try {
      console.log("Initializing Real Prisma Client...");
      const { PrismaClient } = require("@prisma/client");
      const client = global.prisma ?? new PrismaClient();
      if (process.env.NODE_ENV !== "production") global.prisma = client;
      console.log("Real Prisma Client initialized successfully");
      return client;
    } catch (err) {
      console.error("CRITICAL: Failed to initialize Prisma Client:", err);
      // Only fall back if explicitly intended, otherwise we want to know it failed
    }
  } else {
    console.log("No valid DATABASE_URL found. Using Mock DB.");
  }

  console.warn("Falling back to MOCK DB. Data will not persist!");
  return createMockDb();
};

export const db = getClient();
