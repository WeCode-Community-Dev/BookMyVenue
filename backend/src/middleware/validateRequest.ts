import { AppError } from "../utils/AppError.js";

import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validateRequest(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(new AppError(400, "VALIDATION_ERROR", "Validation failed", result.error.flatten()));
      return;
    }

    req.body = result.data;
    next();
  };
}
