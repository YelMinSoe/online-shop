import { prisma } from "../lib/prisma.ts";

// Find all products
export const findAllProducts = async (
  page: number,
  limit: number,
  categoryId?: number,
) => {
  const where = { isActive: true, ...(categoryId ? { categoryId } : {}) };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }), // total ကိုလည်း filter နဲ့ တူအောင်
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
