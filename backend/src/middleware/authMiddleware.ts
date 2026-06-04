import { prisma } from "../config/db.js";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
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

    if (!user || user.deletedAt) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    if (!user.isActive) {
      throw new AppError(
        403,
        "ACCOUNT_SUSPENDED",
        "Your account has been suspended. Please contact support."
      );
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

// Auth middleware for venue


export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "your_super_secret_key");
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
