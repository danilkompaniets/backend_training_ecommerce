import { ErrorCodes, HttpException } from "./root";

export class InternalException extends HttpException {
  constructor(message: string, errors: any, errorCode: ErrorCodes) {
    super(message, errorCode, 400, errors);
  }
}
