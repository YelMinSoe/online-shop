import { body } from "express-validator";

export const orderValidator = {
  createOrder: [
    body("items", "Cart is empty").isArray({ min: 1 }),
    body("items.*.productId", "Invalid product").isInt({ min: 1 }).toInt(),
    body("items.*.quantity", "Invalid quantity")
      .isInt({ min: 1, max: 100 })
      .toInt(),
  ],
};
