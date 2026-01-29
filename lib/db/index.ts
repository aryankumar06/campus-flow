git declare global {
  // eslint-disable-next-line no-var
  var prisma: any | undefined;
}

const getClient = (): any => {
  try {
    const { PrismaClient } = require("@prisma/client");
    return new PrismaClient();
  } catch {
    return ({} as any);
  }
};

export const db = global.prisma || getClient();
if (process.env.NODE_ENV !== "production") global.prisma = db;
