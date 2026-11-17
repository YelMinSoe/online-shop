import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../utils/errorResponse.ts";
import { orderService } from "../../services/orders/orderService.ts";
import { orderValidator } from "../../middlewares/validators/orders/orderValidator.ts";

//Types
interface CustomRequest extends Request {
  userId?: number;
}
export const orderController = {
  createOrder: [
    orderValidator.createOrder,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(400, errors[0].msg);
      }

      const { order } = await orderService.createOrder(
        req.userId!,
        req.body.items,
      );

      res.status(201).json({ message: "Order placed successfully", order });
    },
  ],
};
