import { prisma } from "../config/db.js";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

import type { NextFunction, Request, Response } from "express";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    const token = authHeader.slice(7);

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw new AppError(401, "UNAUTHORIZED", "Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.deletedAt || !user.isActive) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
