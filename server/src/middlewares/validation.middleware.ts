import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ResponseUtil } from '../utils/responseUtils';
import { logWarn, logError } from '../utils/logger';

export interface ValidationSchema {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

const formatErrorLog = (error: z.ZodError): { path: string; message: string; code: string }[] => {
  return error.issues.map((issues) => ({
    path: issues.path.join('.') || 'unknown',
    message: issues.message,
    code: issues.code,
  }));
};

const formatErrorMessage = (error: z.ZodError): string => {
  return error.issues
    .map((issues) => {
      const field = issues.path.join('.') || 'unknown';
      return `${field}: ${issues.message}`;
    })
    .join(', ');
};

const validate = (
  schema: ValidationSchema
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.validated = req.validated ?? {};

      if (schema.body) {
        const bodyResult = schema.body.safeParse(req.body);
        if (!bodyResult.success) {
          const errorLog =
            bodyResult.error instanceof z.ZodError
              ? formatErrorLog(bodyResult.error)
              : 'Invalid request body';
          const errorMessage =
            bodyResult.error instanceof z.ZodError
              ? formatErrorMessage(bodyResult.error)
              : 'Invalid request body';
          logWarn('Request body validation failed', { errorLog });
          ResponseUtil.badRequest(res, errorMessage);
          return;
        }
        req.body = bodyResult.data;
        req.validated.body = bodyResult.data;
      }

      if (schema.params) {
        const paramsResult = schema.params.safeParse(req.params);
        if (!paramsResult.success) {
          const errorLog =
            paramsResult.error instanceof z.ZodError
              ? formatErrorLog(paramsResult.error)
              : 'Invalid request parameters';
          const errorMessage =
            paramsResult.error instanceof z.ZodError
              ? formatErrorMessage(paramsResult.error)
              : 'Invalid request parameters';
          logWarn('Request params validation failed', { errorLog });
          ResponseUtil.badRequest(res, errorMessage);
          return;
        }
        req.validated.params = paramsResult.data;
      }

      if (schema.query) {
        const queryResult = schema.query.safeParse(req.query);
        if (!queryResult.success) {
          const errorLog =
            queryResult.error instanceof z.ZodError
              ? formatErrorLog(queryResult.error)
              : 'Invalid query parameters';
          const errorMessage =
            queryResult.error instanceof z.ZodError
              ? formatErrorMessage(queryResult.error)
              : 'Invalid query parameters';
          logWarn('Request query validation failed', { errorLog });
          ResponseUtil.badRequest(res, errorMessage);
          return;
        }
        req.validated.query = queryResult.data;
      }

      next();
    } catch (error) {
      logError('Validation middleware error', { module: 'validation.middleware.ts', error });
      ResponseUtil.internalServerError(res, 'Validation error');
    }
  };
};

export const validateBody = (
  schema: z.ZodType
): ((req: Request, res: Response, next: NextFunction) => void) => validate({ body: schema });
export const validateParams = (
  schema: z.ZodType
): ((req: Request, res: Response, next: NextFunction) => void) => validate({ params: schema });
export const validateQuery = (
  schema: z.ZodType
): ((req: Request, res: Response, next: NextFunction) => void) => validate({ query: schema });
