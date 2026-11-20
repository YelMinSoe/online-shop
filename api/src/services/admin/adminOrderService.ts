import path from "node:path";
import { adminOrderRepo } from "../../repos/admin/adminOrderRepo.ts";
import { errorResponse } from "../../utils/errorResponse.ts";

export const adminOrderService = {
  // get orders
  getOrders: async (
    status: "PENDING" | "SHIPPED",
    page: number,
    limit: number,
  ) => {
    const { orders, total } = await adminOrderRepo.findOrdersByStatus(
      status,
      page,
      limit,
    );
    return {
      orders: orders.map(({ paymentSlip, ...o }) => ({
        ...o,
        hasSlip: !!paymentSlip,
      })),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  },
  // get slip's path
  getSlipPath: async (id: number) => {
    const order = await adminOrderRepo.findOrderById(id);
    if (!order?.paymentSlip) throw errorResponse(404, "Payment slip not found");
    return path.join(
      process.cwd(),
      "private",
      "slips",
      path.basename(order.paymentSlip),
    );
  },
  // Send order
  sendOrder: async (id: number) => {
    const result = await adminOrderRepo.markOrderAsSent(id);
    if (result.count === 0) {
      const order = await adminOrderRepo.findOrderById(id);
      if (!order) errorResponse(404, "Order not found");
      errorResponse(409, "Order is no longer pending");
    }
  },
};
