import { body } from "express-validator";

export const orderValidator = {
  createOrder: [
    // multipart ကြောင့် string လာတဲ့ items ကို array ပြောင်း
    body("items").customSanitizer((value) => {
      if (typeof value !== "string") return value;
      try {
        return JSON.parse(value);
      } catch {
        return value; // if cannot parse , return string
      }
    }),
    body("items", "Cart is empty").isArray({ min: 1 }),
    body("items.*.productId", "Invalid product").isInt({ min: 1 }).toInt(),
    body("items.*.quantity", "Invalid quantity")
      .isInt({ min: 1, max: 100 })
      .toInt(),
  ],
};
