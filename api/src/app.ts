// Package imports
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

// Local imports
// Routes
import authRoutes from "./routes/authRoute.ts";
import adminRoutes from "./routes/admin/userRoute.ts";
// Auth Middleware
import { authMiddleware } from "./middlewares/auth.ts";
import { authorise } from "./middlewares/authorise.ts";

export const app = express();

app
  .use(morgan("dev"))
  .use(helmet())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors())
  .use(cookieParser());

//Using Ejs
app.set("views", "./src/views");
app.set("view engine", "ejs");

// Health-check route
app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Server is Ready!" });
});

// Auth Routes
app.use("/api/auth", authRoutes);
app.use(
  "/api/auth/admin/users",
  authMiddleware,
  authorise(true, "ADMIN"),
  adminRoutes,
);

// Error Handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  return res.status(status).json({ message });
});
