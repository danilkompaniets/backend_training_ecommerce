import { Request, Response } from "express";
import { AdressSchema, UpdateUserSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { prismaClient } from "..";
import { Adress } from "@prisma/client";
import { any } from "zod";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addAdress = async (req: any, res: Response) => {
  AdressSchema.parse(req.body);
  const adress = await prismaClient.adress.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.json(adress);
};
export const deleteAdress = async (req: Request, res: Response) => {
  try {
    await prismaClient.adress.delete({
      where: { id: +req.params.id },
    });
    res.json({ sucess: true });
  } catch (error) {
    throw new NotFoundException("adress not found", ErrorCodes.USER_NOT_FOUND);
  }
};
export const listAdresses = async (req: any, res: Response) => {
  const adresses = await prismaClient.adress.findMany({
    where: { userId: req.user.id },
  });
};

export const updateUser = async (req: any, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAdress: Adress;
  let billingAdress: Adress;
  if (validatedData.defaultShippingAdress) {
    try {
      shippingAdress = await prismaClient.adress.findFirstOrThrow({
        where: { id: validatedData.defaultShippingAdress },
      });
      if (shippingAdress.userId !== req.user.id) {
        throw new BadRequestsException(
          "Adress is not belong to user",
          ErrorCodes.ADRESS_DOES_NOT_BELONG
        );
      }
    } catch (error) {
      throw new NotFoundException("Not found", ErrorCodes.USER_NOT_FOUND);
    }
  }
  if (validatedData.defaultBillingAdress) {
    try {
      billingAdress = await prismaClient.adress.findFirstOrThrow({
        where: { id: validatedData.defaultBillingAdress },
      });
      if (billingAdress.userId !== req.user.id) {
        throw new BadRequestsException(
          "Adress is not belong to user",
          ErrorCodes.ADRESS_DOES_NOT_BELONG
        );
      }
    } catch (error) {
      throw new NotFoundException("Not found", ErrorCodes.USER_NOT_FOUND);
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: { id: req.user.id },
    data: validatedData,
  });

  res.json(updatedUser);
};
