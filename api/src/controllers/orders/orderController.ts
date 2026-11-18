import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import fs from "node:fs/promises";
// Local imports
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
      const file = req.file;
      const removeSlip = async () => {
        if (file) await fs.unlink(file.path).catch(() => {});
      };

      try {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) errorResponse(400, errors[0].msg);
        if (!file) errorResponse(400, "Payment slip is required");

        const { order } = await orderService.createOrder(
          req.userId!,
          req.body.items,
          file!.filename,
        );
        res.status(201).json({ message: "Order placed successfully", order });
      } catch (error) {
        await removeSlip(); // if order don't success,remove also remove uploaded file
        throw error;
      }
    },
  ],
};
