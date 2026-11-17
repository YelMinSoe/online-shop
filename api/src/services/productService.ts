import { findAllProducts } from "../repos/productRepo.ts";

export const getAllProducts = async () => {
  const products = await findAllProducts();
  return { products };
};
