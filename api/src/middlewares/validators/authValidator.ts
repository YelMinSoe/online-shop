import { body } from "express-validator";

export const authValidator = {
  register: [
    body("email", "Invalid email and please try again.")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email format.")
      .isLength({ max: 52 })
      .withMessage("Invalid or too long email."),
  ],
  verifyOtp: [
    body("email", "Invalid email and please try again.")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email format.")
      .isLength({ max: 52 })
      .withMessage("Invalid or too long email."),
    body("otp", "Invalid OTP and please try again.")
      .trim()
      .notEmpty()
      .withMessage("OTP is required.")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits  long."),
    body("token", "Invalid verify token and please try again.")
      .trim()
      .notEmpty()
      .withMessage("Verify token is required.")
      .escape(),
  ],
};
