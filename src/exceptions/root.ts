export class HttpException extends Error {
  message: string;
  errorCode: ErrorCodes;
  statusCode: number;
  errors: any;

  constructor(
    message: string,
    errorCode: ErrorCodes,
    statusCode: number,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCodes {
  USER_NOT_FOUND = 1001,
  PRODUCT_NOT_FOUND = 1002,
  USER_ALREDY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNPROCESSABLE_ENTITY = 2001,
  INTERNAL_EXCEPTION = 3001,
  UNAUTHORIZED = 4001,
  ADRESS_DOES_NOT_BELONG = 5001,
  ORDER_NOT_FOUND = 6001,
}
