import { Response } from "express";

export class ResponseHandler<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T
  ) {}

  // ✅ Service-Level Response Handlers
  static success<T>(message: string, data?: T): ResponseHandler<T> {
    return new ResponseHandler(true, message, data);
  }

  static error(message: string, data: any = null): ResponseHandler<null> {
    return new ResponseHandler(false, message, data);
  }

  // ✅ Controller-Level Response Handlers
  static successResponse<T>(
    res: Response,
    message: string,
    data?: T,
    code: number = 200
  ) {
    return res.status(code).json({ success: true, message, code, data });
  }

  static errorResponse(res: Response, message: string, code: number) {
    return res.status(code).json({ success: false, message, code, data: null });
  }
}
