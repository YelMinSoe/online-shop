import { query } from "express-validator";

export const pagination = [
  query("page").optional().isInt({ min: 1, max: 100000 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  query("categoryId").optional().isInt({ min: 1, max: 2147483647 }).toInt(),
];
