import type { Request, Response, NextFunction } from "express";

export const productController = {
  // create a new product
  createNewProduct: async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, categoryId } = req.body;
  },
};
