import { prisma } from "../../lib/prisma.ts";

export const adminOrderRepo = {
  // Find order by status
  findOrdersByStatus: async (
    status: "PENDING" | "SHIPPED",
    page: number,
    limit: number,
  ) => {
    const where = { status };
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,

        orderBy: { createdAt: status === "PENDING" ? "asc" : "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          code: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          paymentSlip: true,
          user: {
            select: {
              email: true,
              address: {
                select: {
                  name: true,
                  phone: true,
                  postalCode: true,
                  address: true,
                },
              },
            },
          },
          products: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);
    return { orders, total };
  },
  //Find order by id
  findOrderById: (id: number) =>
    prisma.order.findUnique({
      where: { id },
      select: { id: true, paymentSlip: true },
    }),
  // mark as sent
  markOrderAsSent: (id: number) =>
    prisma.order.updateMany({
      where: { id, status: "PENDING" },
      data: { status: "SHIPPED" },
    }),
};
