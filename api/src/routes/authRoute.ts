// Package imports
import express from "express";

// Local imports
import { authControllers } from "../controllers/authController.ts";
import { authMiddleware } from "../middlewares/auth.ts";

const router = express.Router();

router.post("/register", ...authControllers.register);
router.post("/verify-otp", ...authControllers.verifyOtp);
router.post("/confirm-password", ...authControllers.confirmPassword);
router.post("/login", ...authControllers.login);
router.post("/logout", authControllers.logout);
router.post("/forget-password", ...authControllers.forgetPassword);
router.post(
  "/verify-otp-forget-password",
  ...authControllers.verifyOtpForForgetPassword,
);
router.post("/reset-password", ...authControllers.resetPassword);
router.get("/me", authMiddleware, authControllers.me);

export default router;
