import { UserModel } from '../user/user.models';
import type { IUser } from '../user/user.models';
import { RoleModel } from '../../models/role.model';
import type { IRole } from '../../models/role.model';
import { UserRoleModel } from '../../models/user-role.model';
import type { IUserRole } from '../../models/user-role.model';
import type mongoose from 'mongoose';
import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import { buildPaginationMeta } from '../../utils/paginationUtils';

export async function findActiveUserByEmail(email: string): Promise<IUser | null> {
  return UserModel.findOne({ email, active: true, deleted: false }).exec();
}

export async function findUserById(userId: string): Promise<IUser | null> {
  return UserModel.findById(userId).exec();
}

export async function findRoleByName(name: string): Promise<IRole | null> {
  return RoleModel.findOne({ name }).exec();
}

export async function findUserRole(
  userId: mongoose.Types.ObjectId,
  roleId: mongoose.Types.ObjectId
): Promise<IUserRole | null> {
  return UserRoleModel.findOne({ userId, roleId }).exec();
}

export async function createUserRole(
  userId: mongoose.Types.ObjectId,
  roleId: mongoose.Types.ObjectId
): Promise<IUserRole> {
  return UserRoleModel.create({ userId, roleId });
}

export async function updateUserRoleStatus(
  existing: IUserRole,
  active: boolean,
  deleted: boolean
): Promise<void> {
  existing.active = active;
  existing.deleted = deleted;
  await existing.save();
}

export async function findAdminsWithPagination(
  paginationParams: PaginationParams,
  adminRoleId: mongoose.Types.ObjectId
): Promise<PaginatedResponse<Record<string, unknown>, 'admins'>> {
  const { limit, skip } = paginationParams;
  const matchStage = { roleId: adminRoleId, active: true, deleted: false };

  const [userRoles, totalCountResult] = await Promise.all([
    UserRoleModel.aggregate<Record<string, unknown>>([
      { $match: matchStage },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'Users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          username: '$user.username',
          email: '$user.email',
          active: '$user.active',
          createdAt: '$user.createdAt',
        },
      },
    ]),
    UserRoleModel.countDocuments(matchStage),
  ]);

  return {
    admins: userRoles,
    pagination: buildPaginationMeta(totalCountResult, paginationParams),
  };
}
