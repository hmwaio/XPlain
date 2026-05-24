import { prisma } from "../../lib/prisma.lib.js";

/* Cleanup Unverified Users */
export const cleanupUnverifiedUsers = async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const result = await prisma.authSession.deleteMany({
    where: {
      created_at: {
        lt: oneHourAgo,
      },
    },
  });
  return { deletedCount: result.count };
};
