import express from "express";
import { categoryController } from "../controllers/categoryController.ts";

const router = express.Router();

router.get("/get-categories", categoryController.getAllCategories);

export default router;
