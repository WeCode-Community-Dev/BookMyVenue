import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { BadRequestException, UnauthorizedException } from "../utils/appError";
import { RoleEnumType } from "../enums/user-enum";
import {
  getAllUsersService,
  updateUserRoleService,
  deleteUserService,
} from "../services/user.service";
import { updateUserRoleSchema } from "../validator/user.validator";

export const getAllUsersController = asyncHandler(async (_req: Request, res: Response) => {
  const users = await getAllUsersService();

  return res.status(HTTP_STATUS.OK).json({
    message: "Users fetched successfully",
    users,
  });
});

export const updateUserRoleController = asyncHandler(async (req: Request, res: Response) => {
  const requesterId = req.user?.userId;
  if (!requesterId) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const targetUserId = req.params.userId;
  if (typeof targetUserId !== "string" || !isValidObjectId(targetUserId)) {
    throw new BadRequestException("Invalid user id");
  }

  const { role } = updateUserRoleSchema.parse(req.body);

  const user = await updateUserRoleService({
    targetUserId,
    role: role as RoleEnumType,
    requesterId,
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "User role updated successfully",
    user,
  });
});

export const deleteUserController = asyncHandler(async (req: Request, res: Response) => {
  const requesterId = req.user?.userId;
  if (!requesterId) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const targetUserId = req.params.userId;
  if (typeof targetUserId !== "string" || !isValidObjectId(targetUserId)) {
    throw new BadRequestException("Invalid user id");
  }

  await deleteUserService({ targetUserId, requesterId });

  return res.status(HTTP_STATUS.OK).json({
    message: "User deleted successfully",
  });
});
