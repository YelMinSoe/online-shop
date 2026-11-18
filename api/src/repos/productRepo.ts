import { prisma } from "../lib/prisma.ts";

// Find all products
export const findAllProducts = async () => {
  return await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });
};

// find product by id
export const findProductById = async (id: number) => {
  return await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });
};
