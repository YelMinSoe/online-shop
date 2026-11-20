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
import productRoutes from "./routes/admin/productRoute.ts";
import productRoutesForUser from "./routes/productRoute.ts";
import addressRoutes from "./routes/address/addressRoute.ts";
import orderRoutes from "./routes/orders/orderRoute.ts";
import categoryRoutes from "./routes/categoryRoute.ts";
import adminOrderRoutes from "./routes/admin/adminOrderRoute.ts";
// Auth Middleware
import { authMiddleware } from "./middlewares/auth.ts";
import { authorise } from "./middlewares/authorise.ts";
import path from "node:path";

export const app = express();

app
  .use(morgan("dev"))
  .use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin", //for shown image in frontend
      },
    }),
  )
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
  .use(cookieParser())
  .use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//Using Ejs
app.set("views", "./src/views");
app.set("view engine", "ejs");

// Health-check route
app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Server is Ready!" });
});

// Admin routes (users)
app.use(
  "/api/auth/admin/users",
  authMiddleware,
  authorise(true, "ADMIN"),
  adminRoutes,
);
// Prouduct routes (for admin)
app.use(
  "/api/auth/admin/products",
  authMiddleware,
  authorise(true, "ADMIN"),
  productRoutes,
);
// Order routes (for admin)
app.use(
  "/api/auth/admin/orders",
  authMiddleware,
  authorise(true, "ADMIN"),
  adminOrderRoutes,
);
// Auth Routes
app.use("/api/auth", authRoutes);

// Adress routes
app.use("/api/auth/address", authMiddleware, addressRoutes);
// Order routes
app.use("/api/auth/orders", authMiddleware, orderRoutes);
// Product route (for users)
app.use("/api/products", productRoutesForUser);
// Category route (for users)
app.use("/api/categories", categoryRoutes);

// Error Handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  return res.status(status).json({ message });
});
