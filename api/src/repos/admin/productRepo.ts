import { Prisma } from "../../../generated/prisma/client.ts";
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
  const used = await prisma.productOnOrder.count({ where: { productId: id } });

  if (used > 0) {
    // if in order list hide it
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return { hidden: true };
  }

  // if don't have in order list , delete it
  await prisma.product.delete({ where: { id } });
  return { hidden: false };
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
// export const findAllProducts = async () => {
//   return await prisma.product.findMany({
//     include: { images: true },
//     orderBy: { createdAt: "desc" },
//   });
// };
// Find all categories
export const findAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// Find category by Id
export const findCategoryById = async (id: number) => {
  return await prisma.category.findUnique({ where: { id } });
};
// Drop category
export const dropCategory = async (id: number) => {
  return await prisma.category.delete({ where: { id } });
};
