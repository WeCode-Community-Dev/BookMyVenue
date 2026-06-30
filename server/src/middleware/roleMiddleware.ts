import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";

export const allowRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: "Access denied. You do not have permission.",
      });
      return;
    }

    next();
  };
};

