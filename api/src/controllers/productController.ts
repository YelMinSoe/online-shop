import type { Request, Response, NextFunction } from "express";
import { getAllProducts } from "../services/productService.ts";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { products } = await getAllProducts();
  res.status(200).json({ products });
};
