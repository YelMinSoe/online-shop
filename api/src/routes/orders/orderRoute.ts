import express from "express";
import { orderController } from "../../controllers/orders/orderController.ts";
import { uploadSlip } from "../../middlewares/uploadSlip.ts";

const router = express.Router();

router.post(
  "/place-orders",
  uploadSlip.single("paymentSlip"),
  ...orderController.createOrder,
);
router.get("/get-my-orders", orderController.getMyOrders);
export default router;
