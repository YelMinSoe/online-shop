import { prisma } from "../../lib/prisma.ts";
import { errorResponse } from "../../utils/errorResponse.ts";

// Create new a product
export const createNewProduct = async (productData: any, urlPath?: string) => {
  const product = await prisma.product.create({
    data: productData,
  });

  if (urlPath) {
    await prisma.image.create({
      data: { urlPath, productId: product.id },
    });
  }
};

// Create category
export const createCategory = async (name: string) => {
  return await prisma.category.create({
    data: { name },
  });
};
// find category by name
export const findCategoryByName = async (name: string) => {
  return await prisma.category.findUnique({
    where: { name },
  });
};

// Delete product

export const deleteProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    errorResponse(404, "Product not found");
  }
  return await prisma.product.delete({ where: { id } });
};
