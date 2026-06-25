import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler.middleware";
import { ForbiddenException, UnauthorizedException } from "../utils/appError";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { hasPermission, PermissionType } from "../utils/role-permission";
import { RoleEnumType } from "../enums/user-enum";

export const authorize = (permission: PermissionType) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedException(
        "Unauthorized. Please log in",
        ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND,
      );
    }

    if (!hasPermission(req.user.role as RoleEnumType, permission)) {
      throw new ForbiddenException("You do not have permission to perform this action");
    }

    next();
  });
