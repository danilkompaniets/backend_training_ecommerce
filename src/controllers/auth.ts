import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignupSchema.parse(req.body);
  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email: email } });
  if (user) {
    return next(
      new BadRequestsException(
        "User alredy exists",
        ErrorCodes.USER_ALREDY_EXISTS
      )
    );
  }
  if (!user) {
    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });
  }
  res.json({ user });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email: email } });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND);
  }
  if (!compareSync(password, user!.password)) {
    return next(
      new BadRequestsException(
        "Incorrect password",
        ErrorCodes.INCORRECT_PASSWORD
      )
    );
  }

  const token = jwt.sign(
    {
      userId: user!.id,
    },
    JWT_SECRET
  );

  res.json({ user, token });
};

export const me = async (req: any, res: Response, next: NextFunction) => {
  res.json(req.user);
};
