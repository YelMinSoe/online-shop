import { createNewProduct } from "../../repos/admin/productRepo.ts";

export const procuctService = {
  // create a new product
  createNewProduct: async (
    name: string,
    description: string,
    price: number,
    categoryId: number,
    image: string,
  ) => {
    const newProduct = await createNewProduct({
      name,
      description,
      price,
      categoryId,
      image,
    });
    return { newProduct };
  },
};
