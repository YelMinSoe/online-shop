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
// Find product by Id
export const findProductById = async (id: number) => {
  return await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
};
// Delete product
export const removeProduct = async (id: number) => {
  return await prisma.product.delete({ where: { id } });
};

// Edit product
export const modifyProduct = async (
  id: number,
  productData: any,
  urlPath?: string,
) => {
  const product = await prisma.product.update({
    where: { id },
    data: productData,
  });

  let oldUrlPath: string | undefined;

  if (urlPath) {
    const oldImage = await prisma.image.findFirst({
      where: { productId: id },
    });

    if (oldImage) {
      await prisma.image.update({
        where: { id: oldImage.id },
        data: { urlPath },
      });
      oldUrlPath = oldImage.urlPath;
    } else {
      await prisma.image.create({
        data: { urlPath, productId: id },
      });
    }
  }

  return { product, oldUrlPath };
};

// Find all products
export const findAllProducts = async () => {
  return await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });
};
