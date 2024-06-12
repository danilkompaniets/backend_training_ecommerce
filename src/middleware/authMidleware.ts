import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED)
    );
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      return next(
        new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED)
      );
    }
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
  }
};

export default authMiddleware;
