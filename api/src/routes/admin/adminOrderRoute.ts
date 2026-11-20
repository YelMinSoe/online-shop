import express from "express";
import { adminOrderController } from "../../controllers/admin/adminOrderController.ts";

const router = express.Router();
router.get("/get-orders", ...adminOrderController.getOrders);
router.get("/slip/:id", ...adminOrderController.getSlip);
router.patch("/send-order/:id", ...adminOrderController.sendOrder);
export default router;
