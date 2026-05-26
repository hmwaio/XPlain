import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { HTTP_STATUS } from "./constants/statusCodes.constant.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import searchRoutes from "./routes/search.route.js";
import tagRoutes from "./routes/tags.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

const { INTERNAL_SERVER_ERROR } = HTTP_STATUS;

/* Middleware */
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3001",
      "null", // for local HTML files opened directly
    ],
  }),
);
app.use(express.json());
app.use(cookieParser());

/* Health Check */
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is healthy" });
});

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api", postRoutes);
app.use("/api", userRoutes);
app.use("/api", tagRoutes);
app.use("/api", searchRoutes);

app.use(errorHandler);
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res
    .status(err.status || INTERNAL_SERVER_ERROR)
    .json({ error: err.message || "Internal server error" });
});

export default app;
