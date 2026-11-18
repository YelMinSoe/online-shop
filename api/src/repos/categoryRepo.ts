import { prisma } from "../lib/prisma.ts";

export const categoryRepo = {
  // find category
  findAllCategories: async () => {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  },
};
