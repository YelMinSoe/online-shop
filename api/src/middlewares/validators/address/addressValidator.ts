import { body } from "express-validator";

export const addressValidator = {
  createNewAddress: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Name must not exceed 50 characters"),

    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^0\d{9,10}$/)
      .withMessage("Please enter a valid Japanese phone number"),

    body("postalCode")
      .trim()
      .notEmpty()
      .withMessage("Postal code is required")
      .matches(/^\d{3}-?\d{4}$/)
      .withMessage("Please enter a valid Japanese postal code (e.g. 600-8216)"),

    body("address")
      .trim()
      .notEmpty()
      .withMessage("Address is required")
      .isLength({ max: 255 })
      .withMessage("Address must not exceed 255 characters"),
  ],
  updateAddress: [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .isLength({ max: 50 })
      .withMessage("Name must not exceed 50 characters"),

    body("phone")
      .optional()
      .trim()
      .matches(/^0\d{9,10}$/)
      .withMessage("Please enter a valid Japanese phone number"),

    body("postalCode")
      .optional()
      .trim()
      .matches(/^\d{3}-?\d{4}$/)
      .withMessage("Please enter a valid Japanese postal code (e.g. 600-8216)"),

    body("address")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Address cannot be empty")
      .isLength({ max: 255 })
      .withMessage("Address must not exceed 255 characters"),
  ],
};
