import { AppError } from "../utils/AppError.js";

import type { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, "UNAUTHORIZED", "Authentication required"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError(403, "FORBIDDEN", "Insufficient permissions"));
      return;
    }

    next();
  };
}
