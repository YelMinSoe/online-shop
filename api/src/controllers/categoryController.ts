import type { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/categoryService.ts";

export const categoryController = {
  // Get all categories
  getAllCategories: async (req: Request, res: Response, next: NextFunction) => {
    const { categories } = await categoryService.findAllCategories();
    res.status(200).json(categories);
  },
};
