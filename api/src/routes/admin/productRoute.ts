import express from "express";
import { upload } from "../../middlewares/upload.ts";
import { productController } from "../../controllers/admin/productController.ts";
const router = express.Router();

router.post(
  "/create-new-product",
  upload.single("product-image"),
  ...productController.createNewProduct,
);
router.post("/create-category", ...productController.createCategory);
router.delete("/drop-product/:id", ...productController.deleteProduct);
router.patch(
  "/modify-product/:id",
  upload.single("product-image"),
  ...productController.updateProduct,
);
router.get("/get-all-products", productController.getAllProducts);
router.get("/get-categories", productController.getAllCategories);
router.delete("/drop-category/:id", ...productController.deletCategory);

export default router;
