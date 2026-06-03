import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

import { AppError } from "../utils/AppError.js";

import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    res.status(409).json({
      success: false,
      error: {
        code: "CONFLICT",
        message: "Resource already exists",
      },
    });
    return;
  }

  if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    },
  });
}
