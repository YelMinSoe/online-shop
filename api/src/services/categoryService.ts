import { findAllCategories } from "../repos/admin/productRepo.ts";

export const categoryService = {
  // find category
  findAllCategories: async () => {
    const categories = await findAllCategories();
    return { categories };
  },
};
