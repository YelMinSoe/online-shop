import { prisma } from "../lib/prisma.ts";

// Find all products
export const findAllProducts = async () => {
  return await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });
};
