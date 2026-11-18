import { addressRepo } from "../../repos/address/addressRepo.ts";
import { orderRepo } from "../../repos/orders/orderReop.ts";
import { errorResponse } from "../../utils/errorResponse.ts";
import { codeGenerator } from "../../utils/generate.ts";

// types
type OrderItem = { productId: number; quantity: number };
export const orderService = {
  // Create new order
  createOrder: async (
    userId: number,
    items: OrderItem[],
    paymentSlip: string,
  ) => {
    // check address (optional)
    const address = await addressRepo.findAddressByUserId(userId);
    if (!address) {
      throw errorResponse(400, "Please add a delivery address first");
    }

    // find products from db
    const ids = items.map((item) => item.productId);
    const products = await orderRepo.findProductsByIds(ids);

    let totalPrice = 0;
    const orderLines = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw errorResponse(404, "Product not found");
      }
      if (product.stock < item.quantity) {
        throw errorResponse(400, `Not enough stock for ${product.name}`);
      }

      //   Calculate prices
      const price = Number(product.price);
      const discount = Number(product.discount);
      const unitPrice = price - (price * discount) / 100;

      totalPrice = totalPrice + unitPrice * item.quantity;
      orderLines.push({
        productId: product.id,
        quantity: item.quantity,
        price: unitPrice,
      });
    }
    // order's code
    const code = codeGenerator();
    const order = await orderRepo.saveOrder(
      userId,
      code,
      totalPrice,
      orderLines,
      paymentSlip,
    );
    return { order };
  },
};
