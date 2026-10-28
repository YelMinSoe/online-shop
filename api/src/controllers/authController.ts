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
  login: [
    authValidator.login,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }

      const { email, password } = req.body;

      const { id, accessToken, refreshToken } = await authServices.login(
        email,
        password,
      );

      res
        .cookie("accessToken", accessToken, setCookie(15 * 60 * 1000))
        .cookie(
          "refreshToken",
          refreshToken,
          setCookie(30 * 24 * 60 * 60 * 1000),
        )
        .status(200)
        .json({ message: "Logged in successfully", id });
    },
  ],
  //Logout is started from here
  logout: async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies ? req.cookies.refresh : null;
    await authServices.logout(refreshToken);
    res.clearCookie("accessToken", setCookie(15 * 60 * 1000));
    res.clearCookie("refreshToken", setCookie(30 * 24 * 60 * 60 * 1000));
    res.status(200).json({ message: "Logged out successfully" });
  },
  //Forget Password is started from here
  forgetPassword: [
    authValidator.forgetPassword,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { email } = req.body;
      const { otp, rememberToken } = await authServices.forgetPassword(email);
      res.status(200).json({ otp, rememberToken });
    },
  ],
  // Verify Otp for forget password is started from here
  verifyOtpForForgetPassword: [
    authValidator.verifyOtpForForgetPassword,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { email, otp, token } = req.body;
      const { verifyToken } = await authServices.verifyOtpForForgetPassword(
        email,
        otp,
        token,
      );
      res.status(200).json({
        message: "OTP verified successfully to reset password.",
        verifyToken,
      });
    },
  ],
  // Reset Password is started from here
  resetPassword: [
    authValidator.resetPassword,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { email, password, token } = req.body;
      await authServices.resetPassword(email, password, token);
      res.status(200).json({ message: "Password reset successfully." });
    },
  ],
};
