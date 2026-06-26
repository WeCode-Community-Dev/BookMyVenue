import { ApiError } from '../utils/ApiError.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const code = err instanceof ApiError ? err.code : 'INTERNAL_ERROR';
  const message =
    err instanceof ApiError || process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error';

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: { message, code },
  });
}
