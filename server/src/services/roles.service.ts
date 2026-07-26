import mongoose from 'mongoose';
import { UserRoleModel } from '../models/user-role.model';
import { RoleModel } from '../models/role.model';
import { PermissionModel } from '../models/permission.model';
import { RolePermissionModel } from '../models/role-permission.model';
import { logError, logInfo } from '../utils/logger';

export interface UserRoleInfo {
  roleId: string;
  roleName: string;
}

export async function getUserRole(userId: string): Promise<UserRoleInfo | null> {
  try {
    const result = await UserRoleModel.aggregate<UserRoleInfo>([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          active: true,
          deleted: false,
        },
      },
      {
        $lookup: {
          from: 'Roles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'role',
          pipeline: [{ $match: { active: true, deleted: false } }, { $project: { name: 1 } }],
        },
      },
      { $unwind: '$role' },
      {
        $addFields: {
          priority: {
            $switch: {
              branches: [
                { case: { $eq: ['$role.name', 'superAdmin'] }, then: 4 },
                { case: { $eq: ['$role.name', 'admin'] }, then: 3 },
                { case: { $eq: ['$role.name', 'owner'] }, then: 2 },
                { case: { $eq: ['$role.name', 'user'] }, then: 1 },
              ],
              default: 0,
            },
          },
        },
      },
      { $sort: { priority: -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          roleId: { $toString: '$roleId' },
          roleName: '$role.name',
        },
      },
    ]);

    return result[0] ?? null;
  } catch (e) {
    const error = e as Error;
    logError('getUserRole failed', {
      module: 'roles.service.ts/getUserRole',
      error: error.message,
      userId,
    });
    return null;
  }
}

export async function fetchRolePermissions(roleId: string): Promise<string[]> {
  try {
    const result = await RoleModel.aggregate<{ permissions: string[] }>([
      // 1. Start from the user's own role
      {
        $match: {
          _id: new mongoose.Types.ObjectId(roleId),
          active: true,
          deleted: false,
        },
      },
      // 2. Walk the parentRole chain to collect all ancestors
      {
        $graphLookup: {
          from: 'Roles',
          startWith: '$parentRole',
          connectFromField: 'parentRole',
          connectToField: '_id',
          as: 'ancestors',
          restrictSearchWithMatch: { active: true, deleted: false },
        },
      },
      // 3. Combine own role ID + all ancestor IDs into one array
      {
        $project: {
          _id: 0,
          roleIds: {
            $concatArrays: [['$_id'], '$ancestors._id'],
          },
        },
      },
      // 4. Fetch all RolePermission grants for the full role set
      {
        $lookup: {
          from: 'RolePermissions',
          localField: 'roleIds',
          foreignField: 'roleId',
          as: 'rolePermissions',
          pipeline: [
            { $match: { active: true, deleted: false } },
            { $project: { permissionId: 1, _id: 0 } },
          ],
        },
      },
      // 5. Resolve permission documents
      {
        $lookup: {
          from: 'Permissions',
          localField: 'rolePermissions.permissionId',
          foreignField: '_id',
          as: 'permissions',
          pipeline: [
            { $match: { active: true, deleted: false } },
            { $project: { action: 1, entity: 1, _id: 0 } },
          ],
        },
      },
      { $unwind: '$permissions' },
      // 6. Format as 'action:entity' and deduplicate
      {
        $group: {
          _id: null,
          permissions: {
            $addToSet: {
              $concat: ['$permissions.action', ':', '$permissions.entity'],
            },
          },
        },
      },
    ]);

    return result.length > 0 ? result[0].permissions : [];
  } catch (e) {
    const error = e as Error;
    logError('fetchRolePermissions failed', {
      module: 'roles.service.ts/fetchRolePermissions',
      error: error.message,
      roleId,
    });
    return [];
  }
}

export async function verifyRbacSeed(): Promise<void> {
  try {
    const requiredRoles = ['user', 'owner', 'admin', 'superAdmin'];

    // Check all required roles exist
    const roleCount = await RoleModel.countDocuments({
      active: true,
      deleted: false,
    });

    if (roleCount === 0) {
      throw new Error(
        'No active roles found in database. Run "pnpm script seed:rbac" to initialize RBAC data.'
      );
    }

    for (const roleName of requiredRoles) {
      const exists = await RoleModel.exists({
        name: roleName,
        active: true,
        deleted: false,
      });

      if (!exists) {
        throw new Error(
          `Required role "${roleName}" not found in database. Run "pnpm script seed:rbac" to initialize RBAC data.`
        );
      }
    }

    // Check permissions exist
    const permissionCount = await PermissionModel.countDocuments({
      active: true,
      deleted: false,
    });

    if (permissionCount === 0) {
      throw new Error(
        'No active permissions found in database. Run "pnpm script seed:rbac" to initialize RBAC data.'
      );
    }

    // Check role-permission links exist
    const rolePermissionCount = await RolePermissionModel.countDocuments({
      active: true,
      deleted: false,
    });

    if (rolePermissionCount === 0) {
      throw new Error(
        'No active role-permission links found in database. Run "pnpm script seed:rbac" to initialize RBAC data.'
      );
    }

    // Check admin and superAdmin have at least one permission
    const adminRole = await RoleModel.findOne({ name: 'admin', active: true, deleted: false });
    const superAdminRole = await RoleModel.findOne({
      name: 'superAdmin',
      active: true,
      deleted: false,
    });

    if (adminRole) {
      const adminPerms = await RolePermissionModel.countDocuments({
        roleId: adminRole._id,
        active: true,
        deleted: false,
      });

      if (adminPerms === 0) {
        throw new Error(
          'Admin role has no permissions. Run "pnpm script seed:rbac" to initialize RBAC data.'
        );
      }
    }

    if (superAdminRole) {
      const superAdminPerms = await RolePermissionModel.countDocuments({
        roleId: superAdminRole._id,
        active: true,
        deleted: false,
      });

      if (superAdminPerms === 0) {
        throw new Error(
          'SuperAdmin role has no permissions. Run "pnpm script seed:rbac" to initialize RBAC data.'
        );
      }
    }

    logInfo('RBAC verified');
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logError('RBAC seed verification failed', {
      module: 'roles.service.ts/verifyRbacSeed',
      error: error.message,
    });
    process.exit(1);
  }
}
