import { findAllProducts, findProductById } from "../repos/productRepo.ts";
import { errorResponse } from "../utils/errorResponse.ts";

export const getAllProducts = async () => {
  const products = await findAllProducts();
  return { products };
};
// get product by id
export const getProduct = async (id: number) => {
  const product = await findProductById(id);
  if (!product) throw errorResponse(404, "Product not found");
  return { product };
};
