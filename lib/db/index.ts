import { createMockDb } from "./mock";

declare global {
  // eslint-disable-next-line no-var
  var prisma: any | undefined;
}

const getClient = (): any => {
  const dbUrl = process.env.DATABASE_URL;
  const hasDbUrl = !!dbUrl && !dbUrl.includes("user:password@localhost");

  try {
    if (hasDbUrl) {
      const { PrismaClient } = require("@prisma/client");
      const client = global.prisma ?? new PrismaClient();
      if (process.env.NODE_ENV !== "production") global.prisma = client;
      return client;
    }
  } catch (err) {
    console.warn("Failed to initialize Prisma Client, falling back to mock DB", err);
  }
  return createMockDb();
};

export const db = getClient();
