// Package imports
import express from "express";

// Local imports
import { authControllers } from "../controllers/authController.ts";

const router = express.Router();

router.post("/register", ...authControllers.register);
router.post("/verify-otp", ...authControllers.verifyOtp);
router.post("/confirm-password", ...authControllers.confirmPassword);
router.post("/login", ...authControllers.login);
router.post("/forget-password", ...authControllers.forgetPassword);

export default router;
