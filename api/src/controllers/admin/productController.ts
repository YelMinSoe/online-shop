import type { Request, Response, NextFunction } from "express";
import { productValidator } from "../../middlewares/validators/admin/productValidator.ts";
import { validationResult } from "express-validator";
import { errorResponse } from "../../utils/errorResponse.ts";
import { procuctService } from "../../services/admin/productService.ts";

export const productController = {
  // create a new product
  createNewProduct: [
    productValidator.createNewProduct,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { name, description, price, discount, stock, categoryId } =
        req.body;

      await procuctService.createNewProduct(
        {
          name,
          description,
          price,
          discount,
          stock,
          categoryId,
        },
        req.file,
      );
      res.status(201).json({ message: "Create a new product successfully" });
    },
  ],
  createCategory: [
    productValidator.createCategory,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { name } = req.body;
      await procuctService.createCategory(name);
      res.status(201).json({ message: "Added category succussfully" });
    },
  ],
  //   Delete product
  deleteProduct: [
    productValidator.deleteProduct,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { id } = req.params;
      await procuctService.deleteProduct(Number(id));
      res.status(200).json({ message: "Deleted product successfully" });
    },
  ],
  //   Modify product
  updateProduct: [
    productValidator.updateProduct,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { id } = req.params;
      const { name, description, price, discount, stock, categoryId } =
        req.body;
      await procuctService.updateProduct(
        Number(id),
        {
          name,
          description,
          price,
          discount,
          stock,
          categoryId,
        },
        req.file,
      );
      res.status(201).json({ message: "Updated product data successfully" });
    },
  ],
  // Get all products
  getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
    const { products } = await procuctService.getAllProducts();
    res.status(200).json({ products });
  },
  // Get all categories
  getAllCategories: async (req: Request, res: Response, next: NextFunction) => {
    const { categories } = await procuctService.getAllCategories();
    res.status(200).json({ categories });
  },
};
