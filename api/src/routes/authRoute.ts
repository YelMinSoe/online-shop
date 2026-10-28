// Package imports
import express from "express";

// Local imports
import { authControllers } from "../controllers/authController.ts";

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

export default router;
