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
};
