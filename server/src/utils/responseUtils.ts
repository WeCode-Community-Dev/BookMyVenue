import type { Response } from 'express';
import type { ApiResponse } from '../types/express';
import type { PaginationMeta } from '../types/pagination.types';

function sendSuccess(res: Response, message: string, data?: unknown, statusCode = 200): void {
  const response: ApiResponse = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  res.status(statusCode).json(response);
}

function sendError(res: Response, message: string, error?: string, statusCode = 500): void {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error !== undefined && { error }),
  };
  res.status(statusCode).json(response);
}

export const ResponseUtil = {
  success(res: Response, message: string, data?: unknown, statusCode = 200): void {
    sendSuccess(res, message, data, statusCode);
  },

  paginated(
    res: Response,
    message: string,
    items: unknown[],
    pagination: PaginationMeta,
    dataKey = 'items'
  ): void {
    sendSuccess(res, message, {
      [dataKey]: items,
      pagination,
    });
  },

  error(res: Response, message: string, error?: string, statusCode = 500): void {
    sendError(res, message, error, statusCode);
  },

  created(res: Response, message: string, data: unknown): void {
    sendSuccess(res, message, data, 201);
  },

  notFound(res: Response, message = 'Resource not found'): void {
    sendError(res, message, undefined, 404);
  },

  badRequest(res: Response, message: string, error?: string): void {
    sendError(res, message, error, 400);
  },

  unauthorized(res: Response, message = 'Unauthorized'): void {
    sendError(res, message, undefined, 401);
  },

  forbidden(res: Response, message = 'Forbidden'): void {
    sendError(res, message, undefined, 403);
  },

  conflict(res: Response, message: string, error?: string): void {
    sendError(res, message, error, 409);
  },

  rateLimitExceeded(
    res: Response,
    message = 'Too many requests. Please try again later',
    error?: string
  ): void {
    sendError(res, message, error, 429);
  },

  validationError(res: Response, message: string, error?: string): void {
    sendError(res, message, error, 422);
  },

  internalServerError(res: Response, message = 'Internal Server Error', error?: string): void {
    sendError(res, message, error, 500);
  },

  serverUnavailable(res: Response, message = 'Service Unavailable', error?: string): void {
    sendError(res, message, error, 503);
  },
};

export const internalServerError = (
  res: Response,
  message = 'Internal Server Error',
  err?: string
): void => {
  sendError(res, message, err, 500);
};

export const serverUnavailable = (
  res: Response,
  message = 'Service Unavailable',
  err?: string
): void => {
  sendError(res, message, err, 503);
};
