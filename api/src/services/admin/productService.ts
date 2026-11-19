//Package import

import {
  createCategory,
  createNewProduct,
  dropCategory,
  findAllCategories,
  findCategoryById,
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
    const category = await createCategory(name);
    return { category };
  },

  //   Delete product
  deleteProduct: async (id: number) => {
    const product = await findProductById(id);
    if (!product) {
      throw errorResponse(404, "Product not found");
    }
    // delete product's image
    const oldUrlPath = product.images[0]?.urlPath;

    const { hidden } = await removeProduct(id);
    if (!hidden && oldUrlPath) {
      await deleteFile(oldUrlPath); // တကယ်ဖျက်တဲ့အခါမှ ပုံဖျက်
    }
    return { product, hidden };
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
  // getAllProducts: async () => {
  //   const products = await findAllProducts();
  //   return { products };
  // },
  // Get all categories
  getAllCategories: async () => {
    const categories = await findAllCategories();
    return { categories };
  },
  // Delete category
  deleteCategory: async (id: number) => {
    const category = await findCategoryById(id);
    if (!category) {
      errorResponse(404, "Category not found");
    }
    await dropCategory(id);
  },
};
