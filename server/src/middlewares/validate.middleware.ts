import logger from '@/libs/logger';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AppError } from '@/utils/AppError';
import { ZodError, ZodSchema } from 'zod';

export const validateInputs = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;

      logger.info(`Inputs: ${JSON.stringify(req.body)}`);

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName] as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }

    next();
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.locals.validateQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.flatten(),
        });
        return;
      }

      next(error);
    }
  };
};
