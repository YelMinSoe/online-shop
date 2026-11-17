import express from "express";
import { getProducts } from "../controllers/productController.ts";
const router = express.Router();

router.get("/get-all-products", getProducts);

export default router;
