import { body } from "express-validator";

export const userValidator = {
  freezeUser: [
    body("email", "Invalid email and please try again.")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email format.")
      .isLength({ max: 52 })
      .withMessage("Invalid or too long email."),
    body("status", "Invvalid status and please try again.")
      .trim()
      .isIn(["ACTIVE", "FREEZE"]),
  ],
};
