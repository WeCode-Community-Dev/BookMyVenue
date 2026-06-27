import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import { RoleEnumType } from "../enums/user-enum";

export const getAllUsersService = async () => {
  return UserModel.find().select("-password").sort({ createdAt: -1 });
};

export const updateUserRoleService = async ({
  targetUserId,
  role,
  requesterId,
}: {
  targetUserId: string;
  role: RoleEnumType;
  requesterId: string;
}) => {
  if (targetUserId === requesterId) {
    throw new BadRequestException("You cannot change your own role");
  }

  const user = await UserModel.findById(targetUserId).select("-password");
  if (!user) {
    throw new NotFoundException("User not found");
  }

  user.role = role;
  await user.save();

  return user;
};

export const deleteUserService = async ({
  targetUserId,
  requesterId,
}: {
  targetUserId: string;
  requesterId: string;
}) => {
  if (targetUserId === requesterId) {
    throw new BadRequestException("You cannot delete your own account");
  }

  const user = await UserModel.findById(targetUserId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  await user.deleteOne();

  return user;
};
