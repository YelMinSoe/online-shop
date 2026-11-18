import express from "express";
import { productController } from "../controllers/productController.ts";

const router = express.Router();

router.get("/get-all-products", productController.getProducts);
router.get("/:id", ...productController.getProductById);

export default router;
