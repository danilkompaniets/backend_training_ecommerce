import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/root";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
      errors: error.errors,
    });
  } else {
    res.status(500).json({
      message: "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};
