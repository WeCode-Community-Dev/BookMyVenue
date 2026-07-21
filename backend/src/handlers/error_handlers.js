import { ZodError } from 'zod';

export class AppError extends Error {
  constructor({ message, statusCode = 500, errorCode, metadata }) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.metadata = metadata;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const globalErrorHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.issues.map((issue) => issue.message).join(', '),
      errorCode: 'VALIDATION_ERROR',
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      metadata: err.metadata,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export const catchErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
