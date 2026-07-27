import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';

/**
 * Middleware factory for validating incoming HTTP requests using Zod schemas.
 * Validates req.body, req.query, and req.params against the provided schema.
 */
export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.issues) {
        const issues = error.issues || (error as any).errors || [];
        const formattedErrors = issues.map((err: any) => ({
          field: Array.isArray(err.path) ? err.path.join('.').replace(/^(body|query|params)\./, '') : 'field',
          message: err.message || 'Invalid input',
        }));

        const errorMessage = `Validation failed: ${formattedErrors.map((e: any) => `${e.field} (${e.message})`).join(', ')}`;
        return next(new AppError(errorMessage, HTTP_STATUS.BAD_REQUEST));
      }
      next(error);
    }
  };
};
