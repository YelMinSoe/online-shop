import { body, param } from "express-validator";

export const productValidator = {
  createNewProduct: [
    body("name", "Invalid product name")
      .trim()
      .notEmpty()
      .withMessage("Product name is required")
      .isLength({ min: 1, max: 52 })
      .withMessage("Product name must be between 1 and 52 characters"),
    body("description")
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("Invalid description"),
    body("price").isFloat({ gt: 0 }).toFloat().withMessage("Invalid price"),
    body("discount").optional().isFloat({ min: 0, max: 100 }).toFloat(),
    body("stock").optional().isInt({ min: 0 }).toInt(),
    body("categoryId")
      .isInt({ min: 1 })
      .toInt()
      .withMessage("Select a category"),
  ],
  createCategory: [
    body("name", "Invalid category name")
      .trim()
      .notEmpty()
      .withMessage("Category name is required.")
      .isLength({ max: 50 })
      .withMessage("Category name must not exceed 50 characters.")
      .toLowerCase()
      .matches("[a-zA-Z]")
      .withMessage("Category name must contain at least one English letter."),
  ],
  deleteProduct: [param("id", "Invalid id").isInt({ min: 1 }).toInt()],
};
