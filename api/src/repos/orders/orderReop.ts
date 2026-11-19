import { prisma } from "../../lib/prisma.ts";
import { errorResponse } from "../../utils/errorResponse.ts";

// types
type OrderLine = { productId: number; quantity: number; price: number };

export const orderRepo = {
  // create new order
  saveOrder: async (
    userId: number,
    code: string,
    totalPrice: number,
    lines: OrderLine[],
    paymentSlip: string,
  ) => {
    return await prisma.$transaction(async (tx) => {
      // protect from enough stock
      for (const line of lines) {
        const result = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (result.count === 0) {
          throw errorResponse(400, "Stock changed, please try again");
        }
      }

      // place new order
      return await tx.order.create({
        data: {
          code,
          totalPrice,
          paymentSlip,
          userId,
          products: { create: lines },
        },
        include: { products: true },
      });
    });
  },
  //   Find products by ids
  findProductsByIds: async (ids: number[]) => {
    return await prisma.product.findMany({ where: { id: { in: ids } } });
  },

  // get orders by user's id
  findOrdersByUserId: async (userId: number) => {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        code: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        products: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: { select: { id: true, name: true } },
          },
        },
      },
    });
  },
  // Cancel order
  cancelOrderById: async (orderId: number, userId: number) => {
    return await prisma.$transaction(async (tx) => {
      // protect order from other user
      const order = await tx.order.findFirst({
        where: { id: orderId, userId },
        include: { products: true },
      });
      if (!order) throw errorResponse(404, "Order not found");

      // change to pending to cancelled
      const result = await tx.order.updateMany({
        where: { id: orderId, userId, status: "PENDING" },
        data: { status: "CANCELLED" },
      });
      if (result.count === 0) {
        throw errorResponse(
          409,
          order.status === "CANCELLED"
            ? "This order is already cancelled"
            : "This order has already been shipped and can no longer be cancelled",
        );
      }

      // increase cancelled stocks
      for (const line of order.products) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { increment: line.quantity } },
        });
      }

      return { ...order, status: "CANCELLED" as const };
    });
  },
};
