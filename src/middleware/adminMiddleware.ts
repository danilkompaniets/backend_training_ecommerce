import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";

const adminMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user.role == "ADMIN") {
    return next();
  } else {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED)
    );
  }
};

export default adminMiddleware;
