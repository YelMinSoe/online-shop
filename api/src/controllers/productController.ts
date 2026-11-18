import type { Request, Response, NextFunction } from "express";
import { getAllProducts, getProduct } from "../services/productService.ts";
import { validationResult } from "express-validator";
import { errorResponse } from "../utils/errorResponse.ts";
import { productValidator } from "../middlewares/validators/admin/productValidator.ts";
import { pagination } from "../middlewares/pagination.ts";

export const productController = {
  getProducts: [
    pagination,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) errorResponse(400, errors[0].msg);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 12;
      const categoryId = req.query.categoryId
        ? Number(req.query.categoryId)
        : undefined;

      const result = await getAllProducts(page, limit, categoryId);
      res.status(200).json(result);
    },
  ],
  getProductById: [
    productValidator.deleteProduct, // id validator due to I don't write it agian
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) errorResponse(400, errors[0].msg);

      const { product } = await getProduct(Number(req.params.id));
      res.status(200).json({ product });
    },
  ],
};
