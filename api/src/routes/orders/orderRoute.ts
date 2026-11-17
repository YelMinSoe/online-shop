import express from "express";
import { orderController } from "../../controllers/orders/orderController.ts";

const router = express.Router();

router.post("/place-orders", ...orderController.createOrder);

export default router;
