import { prisma } from "../../lib/prisma.ts";

// Create new a product
export const createNewProduct = async (productData: any) => {
  return await prisma.product.create({
    data: productData,
  });
};
