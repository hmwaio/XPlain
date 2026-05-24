import { prisma } from "../lib/prisma.lib.js";

export const connection = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  }
};
