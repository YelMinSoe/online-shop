// Package imports
import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Local imports
import { authValidator } from "../middlewares/validators/authValidator.ts";
import { errorResponse } from "../utils/errorResponse.ts";
import { otpGenerator } from "../utils/generate.ts";
import { sendEmail } from "../utils/sendEmail.ts";
import { authServices } from "../services/authService.ts";
import { setCookie } from "../utils/setCookie.ts";

export const authControllers = {
  // Register is started from here
  register: [
    authValidator.register,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { email } = req.body;
      // Calling auth Service with return value of rememberToken and otp
      const { rememberToken, otp } = await authServices.register(email);

      return res.status(200).json({
        message: "We sent OTP to your email.Please check it.",
        rememberToken,
        otp,
      });
    },
  ],

  // Verify Otp is started from here
  verifyOtp: [
    authValidator.verifyOtp,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { email, otp, token } = req.body;
      const { verifyToken } = await authServices.verifyOtp(email, otp, token);
      res
        .status(200)
        .json({ message: "OTP verified successfully.", verifyToken });
    },
  ],
  // Confirm Password is started from here
  confirmPassword: [
    authValidator.confirmPassword,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { email, password, token } = req.body;
      const { id, accessToken, refreshToken } =
        await authServices.confrimPassword(email, password, token);
      res
        .cookie("accessToken", accessToken, setCookie(15 * 60 * 1000))
        .cookie(
          "refreshToken",
          refreshToken,
          setCookie(30 * 24 * 60 * 60 * 1000),
        )
        .status(201)
        .json({ message: "User created successfully", id });
    },
  ],
  //Login is started from here
  login: (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "This is login" });
  },
};
