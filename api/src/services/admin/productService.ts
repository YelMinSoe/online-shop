import {
  createCategory,
  createNewProduct,
  deleteProduct,
  findCategoryByName,
} from "../../repos/admin/productRepo.ts";
import { errorResponse } from "../../utils/errorResponse.ts";

// Types
type CreateNewProductType = {
  name: string;
  description: string;
  price: number;
  discount?: number;
  stock?: number;
  categoryId: number;
};
export const procuctService = {
  // create a new product
  createNewProduct: async (
    {
      name,
      description,
      price,
      discount,
      stock,
      categoryId,
    }: CreateNewProductType,
    file?: Express.Multer.File,
  ) => {
    await createNewProduct(
      {
        name,
        description,
        price,
        discount,
        stock,
        categoryId,
      },
      file?.path,
    );
  },
  //   Create category
  createCategory: async (name: string) => {
    const categoryRow = await findCategoryByName(name);
    if (categoryRow) {
      errorResponse(409, "Category already exists");
    }
    await createCategory(name);
  },
  //   Delete product
  deleteProduct: async (id: number) => {
    await deleteProduct(id);
  },
};
