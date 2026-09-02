import type mongoose from 'mongoose';
import { RoleModel } from '../../src/models/role.model';
import { PermissionModel } from '../../src/models/permission.model';
import { RolePermissionModel } from '../../src/models/role-permission.model';
import { UserRoleModel } from '../../src/models/user-role.model';
import { clearAll } from '../../src/services/cache/permission-cache.service';
import { generateAccessToken } from '../../src/utils/tokenUtils';
import { createTestUser, type CreateTestUserOptions } from './db.helper';
import type { IUser } from '../../src/modules/user/user.models';

const ROLE_PRIORITY: Record<string, number> = {
  user: 100,
  owner: 50,
  admin: 20,
  superAdmin: 1,
};

export interface RoleSession {
  user: IUser;
  roleId: mongoose.Types.ObjectId;
  accessToken: string;
  authHeader: { Authorization: string };
  cookieHeader: string;
}

// Permissions are cached in-process for 15 minutes, so a stale entry would outlive a test
export const resetPermissionCache = (): void => {
  clearAll();
};

// Grants 'action:entity' strings, creating the permission rows they refer to
async function grantPermissions(
  roleId: mongoose.Types.ObjectId,
  permissions: string[]
): Promise<void> {
  for (const permission of permissions) {
    const [action, entity] = permission.split(':');

    const permissionDoc = await PermissionModel.findOneAndUpdate(
      { action, entity },
      { $setOnInsert: { action, entity, active: true, deleted: false } },
      { upsert: true, new: true }
    ).exec();

    await RolePermissionModel.findOneAndUpdate(
      { roleId, permissionId: permissionDoc._id },
      { $setOnInsert: { roleId, permissionId: permissionDoc._id, active: true, deleted: false } },
      { upsert: true }
    ).exec();
  }
}

export async function seedRole(
  name: string,
  permissions: string[] = []
): Promise<mongoose.Types.ObjectId> {
  const role = await RoleModel.findOneAndUpdate(
    { name },
    {
      $setOnInsert: {
        name,
        displayName: name,
        description: `${name} role (test)`,
        parentRole: null,
        priority: ROLE_PRIORITY[name] ?? 100,
        active: true,
        deleted: false,
      },
    },
    { upsert: true, new: true }
  ).exec();

  await grantPermissions(role._id, permissions);
  resetPermissionCache();
  return role._id;
}

// Creates a user, seeds the named role with its permissions, and signs them in
export async function createSessionWithRole(
  roleName: string,
  permissions: string[] = [],
  userOptions: CreateTestUserOptions = {}
): Promise<RoleSession> {
  const roleId = await seedRole(roleName, permissions);
  const user = await createTestUser(userOptions);

  await UserRoleModel.create({
    userId: user._id,
    roleId,
    active: true,
    deleted: false,
  });

  resetPermissionCache();

  const accessToken = generateAccessToken(user.id as string, user.username, user.email);

  return {
    user,
    roleId,
    accessToken,
    authHeader: { Authorization: `Bearer ${accessToken}` },
    cookieHeader: `accessToken=${accessToken}`,
  };
}
