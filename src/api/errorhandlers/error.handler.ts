import { CustomError } from "./error";
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../responses/response";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(CustomError.NotFound());
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let message = "Request failed. Try again later";
  let code = 500;
  let detailedMessage = error.message;

  if (error instanceof CustomError) {
    code = error.code;

    if (error.code !== 500) {
      message = error.message;
    } else {
      message = `Internal Server Error`;
    }
  } else if (
    error instanceof SyntaxError ||
    error instanceof ReferenceError ||
    error instanceof TypeError ||
    error instanceof RangeError ||
    error instanceof URIError ||
    error instanceof EvalError
  ) {
    message = error.message;
    code = 400;
  } else if (error instanceof Error) {
    message = error.message;
    code = 422;
  } else {
    console.error("Unhandled Error:", error); // Log unexpected errors
    return next(error); // Pass to default Express error handler
  }

  if (process.env.NODE_ENV === "production" && code != 404) {
    const context = {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    };

    const body = {
      subject: `🚨 API Error: ${code} - ${message}`,
      content: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #D32F2F;">🚨 API Error Alert</h2>
                    
                    <p><strong>Status:</strong> <span style="color: #D32F2F;">${code}</span></p>
                    <p><strong>Message:</strong> ${detailedMessage}</p>
                    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        
                    <h3>🛠 Request Details</h3>
                    <ul>
                        <li><strong>Method:</strong> ${context.method}</li>
                        <li><strong>Endpoint:</strong> ${context.path}</li>
                        <li><strong>IP Address:</strong> ${context.ip}</li>
                    </ul>
        
                    <h3>📝 Stack Trace</h3>
                    <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto;">
                        ${error.stack}
                    </pre>
        
                    <hr>
                    <p style="font-size: 12px; color: #777;">This is an automated alert from the API Error Handling service.</p>
                </div>
            `,
    };

    // sendEmail('Brilstack API', body, [`akoredeadewole8@gmail.com`]) // replace to send email
  }

  // Ensure the response is sent only once
  if (!res.headersSent) {
    ResponseHandler.errorResponse(res, message, code);
  }
};
