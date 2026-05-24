import { prisma } from "../lib/prisma.lib.js";

// Delete old AuthSessions (older than 1 hour)
export const cleanupAuthSessions = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const result = await prisma.authSession.deleteMany({
      where: {
        created_at: {
          lt: oneHourAgo,
        },
      },
    });

    console.log(`✅ Cleanup: Deleted ${result.count} old auth sessions`);

    return result.count;
  } catch (error) {
    console.error("❌ Auth session cleanup failed:", error);
    return 0;
  }
};

// Run every hour
export const startCleanupJob = () => {
  // Run immediately on startup
  cleanupAuthSessions().catch(console.error);

  // Then run every hour
  setInterval(
    async () => {
      try {
        await cleanupAuthSessions();
      } catch (error) {
        console.error("Cleanup interval failed:", error);
      }
    },
    60 * 60 * 1000,
  );

  console.log("🔄 Cleanup job started (runs every hour)");
};
