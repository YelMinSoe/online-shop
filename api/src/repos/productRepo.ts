import { prisma } from "../lib/prisma.ts";

// Find all products
export const findProducts = async (
  page: number,
  limit: number,
  categoryId?: number,
) => {
  const where = categoryId ? { categoryId } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
};

// find product by id
export const findProductById = async (id: number) => {
  return await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });
};
