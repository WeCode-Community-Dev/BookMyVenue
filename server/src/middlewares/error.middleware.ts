import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import logger from '@/libs/logger';
import { ZodError } from 'zod';

/**
 * Centralized error handling middleware.
 * Must be registered LAST in the Express app middleware chain.
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // ── Zod Validation Errors ──────────────────────────────────────────────────
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: formattedErrors,
    });
    return;
  }

  // ── Operational / Expected Errors ──────────────────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // ── Mongoose CastError (invalid ObjectId) ──────────────────────────────────
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
    return;
  }

  // ── Mongoose Duplicate Key ─────────────────────────────────────────────────
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? 'field';
    res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
    });
    return;
  }

  // ── JWT Errors ─────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token has expired' });
    return;
  }

  // ── Unexpected / Unhandled Errors ─────────────────────────────────────────
  logger.error(
    {
      message: err.message,
      name: err.name,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : '[redacted]',
      path: req.path,
      method: req.method,
    },
    'Unhandled server error'
  );

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
  });
};

export default errorMiddleware;
