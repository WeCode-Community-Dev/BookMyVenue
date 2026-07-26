import { z } from 'zod';
import type { Response } from 'express';
import { logError } from './logger';
import { ResponseUtil } from './responseUtils';

/**
 * Typed application error hierarchy.
 *
 * All domain modules (property, venue, booking, …) throw these instead of plain
 * Error objects so controllers can map them to HTTP status codes without
 * inspecting error messages.
 *
 * Usage in a controller:
 *   catch (e) {
 *     if (e instanceof NotFoundError) return ResponseUtil.notFound(res, e.message);
 *     if (e instanceof ForbiddenError) return ResponseUtil.forbidden(res, e.message);
 *     …
 *   }
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// 404 — resource not found
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

// 403 — authenticated but not authorised (ownership failure)
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

// 409 — uniqueness violation
export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}

// 422 — input passed schema validation but violates a business rule
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

/**
 * 422 — illegal state-machine transition.
 *
 * Thrown by property.workflow.ts when a requested status change is not allowed
 * from the property's current status.
 */
export class WorkflowError extends AppError {
  public readonly currentStatus: string;
  public readonly attemptedTransition: string;

  constructor(currentStatus: string, attemptedTransition: string) {
    super(
      `Cannot perform '${attemptedTransition}': current status is '${currentStatus}'`,
      422,
      'WORKFLOW_ERROR'
    );
    this.currentStatus = currentStatus;
    this.attemptedTransition = attemptedTransition;
  }
}

export function handleError(res: Response, error: unknown, context: string): void {
  if (error instanceof z.ZodError) {
    ResponseUtil.badRequest(res, 'Invalid request parameters');
    return;
  }
  if (error instanceof AppError) {
    switch (error.statusCode) {
      case 400:
        ResponseUtil.badRequest(res, error.message);
        return;
      case 401:
        ResponseUtil.unauthorized(res, error.message);
        return;
      case 403:
        ResponseUtil.forbidden(res, error.message);
        return;
      case 404:
        ResponseUtil.notFound(res, error.message);
        return;
      case 409:
        ResponseUtil.conflict(res, error.message);
        return;
      case 422:
        ResponseUtil.validationError(res, error.message);
        return;
      case 429:
        ResponseUtil.rateLimitExceeded(res, error.message);
        return;
      default:
        ResponseUtil.error(res, error.message, undefined, error.statusCode);
        return;
    }
  }
  const err = error as Error;
  logError(`${context}: unexpected error`, {
    module: 'errorUtils.ts/handleError',
    error: err.message,
    stack: err.stack,
  });
  ResponseUtil.internalServerError(res, 'Server error');
}
