import dotenv from "dotenv";
import app from "./app.js";
import { connection } from "./db/connection.db.js";
import { startCleanupJob } from "./jobs/cleanup.job.js";
import { testConnection } from "./services/email/email.service.js";
dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const PORT = process.env.PORT || 4000;

/* Start Server */
const bootstrap = async () => {
  // 1. Connect all services first
  await connection();
  await testConnection();
  await startCleanupJob();

  app.listen(PORT, async () => {
    console.log(`App is listening on http://localhost:${PORT}`);
  });
};

bootstrap().catch((err) => {
  console.error("❌ Bootstrap failed", err);
  process.exit(1);
});
