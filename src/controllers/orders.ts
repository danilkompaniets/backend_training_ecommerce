import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

interface User {
  id: number; // Adjust the type as per your user ID type
  defaultShippingAddress: number; // Adjust the type as per your address ID type
}
type OrderUpdateInput = {
  status?: any; // Add the status property to the type definition
  // Other properties of OrderUpdateInput
};

export const createOrder = async (req: any, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.json({ message: "cart is empty" });
    }

    const price = cartItems.reduce((prev, curr) => {
      return prev + +curr.product.price * curr.quantity;
    }, 0);

    const address = await tx.adress.findFirst({
      where: { id: req.user.defaultShippingAddress },
    });

    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address!.formattedAddress,
        products: {
          create: cartItems.map((cart) => {
            return { productId: cart.productId, quantity: cart.quantity };
          }),
        },
      },
    });

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.json(order);
  });
};

export const listOrders = async (req: any, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });

  res.json(orders);
};

export const getOrderById = async (req: any, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: { id: +req.params.id },
      include: { products: true, events: true },
    });

    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND);
  }
};

export const cancelOrder = async (req: any, res: Response) => {
  console.log(req.params.id);

  try {
    const order = await prismaClient.order.update({
      where: { id: +req.params.id },
      data: { "status": "CANCELLED" },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELLED",
      },
    });

    res.json(order);
  } catch (error) {
    console.log(error);
    throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND);
  }
};
