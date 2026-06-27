import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler.middleware";
import { UnauthorizedException } from "../utils/appError";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { verifyAccessToken } from "../utils/jwt";
import UserModel from "../models/user.model";

export const isAuthenticated = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException(
        "Unauthorized. Please log in",
        ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND,
      );
    }

    // verify throws on an invalid/expired token -> handled by errorHandler
    const decoded = verifyAccessToken(token);

    // confirm the user still exists (catches deleted accounts) and get a fresh role
    const user = await UserModel.findById(decoded.userId).select("_id role");

    if (!user) {
      throw new UnauthorizedException("User no longer exists", ErrorCodeEnum.AUTH_USER_NOT_FOUND);
    }

    req.user = { userId: String(user._id), role: user.role };
    next();
  },
);
