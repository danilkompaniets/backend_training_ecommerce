import { Request, Response } from "express";
import { ChangeQtySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const addItemToCart = async (req: any, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product;

  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
    if (!product) {
      throw new NotFoundException(
        "Product not found",
        ErrorCodes.PRODUCT_NOT_FOUND
      );
    }
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }

  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.user.id,
      productId: product.id,
      quantity: validatedData.quantity,
    },
  });
  res.json(cart);
};

export const deleteItemFromCart = async (req: any, res: Response) => {
  const cartItem = await prismaClient.cartItem.findFirstOrThrow({
    where: {
      id: +req.params.id,
    },
  });
  if (req.user.id !== cartItem.userId) {
    throw new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED);
  }
  await prismaClient.cartItem.delete({
    where: {
      id: +req.params.id,
    },
  });
  res.json("deleted succesfully");
};

export const changeQty = async (req: any, res: Response) => {
  const cartItem = await prismaClient.cartItem.findFirstOrThrow({
    where: {
      id: +req.params.id,
    },
  });
  if (req.user.id !== cartItem.userId) {
    throw new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED);
  }

  const validatedData = ChangeQtySchema.parse(req.body);
  const updatedCart = await prismaClient.cartItem.update({
    where: { id: +req.params.id },
    data: { quantity: validatedData.quantity },
  });

  res.json(updatedCart);
};

export const getCart = async (req: any, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: { userId: req.user.id },
    include: {
      product: true,
    },
  });

  res.json(cart);
};
