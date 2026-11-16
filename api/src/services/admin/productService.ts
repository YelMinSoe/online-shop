//Package import

import {
  createCategory,
  createNewProduct,
  findAllProducts,
  findCategoryByName,
  findProductById,
  modifyProduct,
  removeProduct,
} from "../../repos/admin/productRepo.ts";
import { deleteFile } from "../../utils/deleteFile.ts";
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
    const product = await findProductById(id);
    if (!product) {
      throw errorResponse(404, "Product not found");
    }

    await removeProduct(id);

    // delete product's image
    const oldUrlPath = product.images[0]?.urlPath;
    if (oldUrlPath) {
      await deleteFile(oldUrlPath);
    }
  },
  //   update product
  updateProduct: async (
    id: number,
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
    const { oldUrlPath } = await modifyProduct(
      id,
      { name, description, price, discount, stock, categoryId },
      file?.path,
    );

    // delete old product's image
    if (oldUrlPath) {
      deleteFile(oldUrlPath);
    }
  },
  // Get all products
  getAllProducts: async () => {
    const products = await findAllProducts();
    return { products };
  },
};
