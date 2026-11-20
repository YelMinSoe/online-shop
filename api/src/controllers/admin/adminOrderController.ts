import type { Request, Response, NextFunction } from "express";

import { validationResult, query } from "express-validator";
import { orderValidator } from "../../middlewares/validators/orders/orderValidator.ts";
import { errorResponse } from "../../utils/errorResponse.ts";
import { adminOrderService } from "../../services/admin/adminOrderService.ts";

export const adminOrderController = {
  getOrders: [
    orderValidator.listOrders,
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) errorResponse(400, errors[0].msg);

      const result = await adminOrderService.getOrders(
        req.query.status as "PENDING" | "SHIPPED",
        Number(req.query.page) || 1,
        Number(req.query.limit) || 10,
        req.query.search ? String(req.query.search) : undefined,
      );
      res.status(200).json(result);
    },
  ],

  getSlip: [
    orderValidator.orderId,
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) errorResponse(400, errors[0].msg);

      const file = await adminOrderService.getSlipPath(Number(req.params.id));
      res.setHeader("Cache-Control", "private, no-store");
      res.sendFile(file);
    },
  ],

  sendOrder: [
    orderValidator.orderId,
    async (req: Request, res: Response) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) errorResponse(400, errors[0].msg);

      await adminOrderService.sendOrder(Number(req.params.id));
      res.status(200).json({ message: "Order marked as shipped" });
    },
  ],
};
