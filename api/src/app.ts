// Package imports
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import type { Request, Response, NextFunction } from "express";

// Local imports
import authRoutes from "./routes/authRoute.ts";
import path from "node:path";
import { tokenGenerator } from "./utils/generate.ts";

export const app = express();

app
  .use(morgan("dev"))
  .use(helmet())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors());

//Using Ejs
app.set("views", "./src/views");
app.set("view engine", "ejs");

// Health-check route
app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Server is Ready!" });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Error Handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  return res.status(status).json({ message });
});
