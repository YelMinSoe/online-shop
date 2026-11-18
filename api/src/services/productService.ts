import { findProducts, findProductById } from "../repos/productRepo.ts";
import { errorResponse } from "../utils/errorResponse.ts";

export const getAllProducts = async (page: number, limit: number) => {
  const { products, total } = await findProducts(page, limit);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return { products, total, page, totalPages };
};
// get product by id
export const getProduct = async (id: number) => {
  const product = await findProductById(id);
  if (!product) throw errorResponse(404, "Product not found");
  return { product };
};
