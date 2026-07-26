import { NotFoundError, ConflictError } from '../../utils/errors';
import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import * as repo from './role.repository';

export async function promoteToAdmin(email: string): Promise<void> {
  const user = await repo.findActiveUserByEmail(email);
  if (!user) throw new NotFoundError('User not found');

  const adminRole = await repo.findRoleByName('admin');
  if (!adminRole) throw new Error('Admin role not found in system');

  const existing = await repo.findUserRole(user._id, adminRole._id);
  if (existing) {
    if (existing.active && !existing.deleted) throw new ConflictError('User is already an admin');
    await repo.updateUserRoleStatus(existing, true, false);
    return;
  }

  await repo.createUserRole(user._id, adminRole._id);
}

export async function demoteAdmin(userId: string): Promise<void> {
  const user = await repo.findUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  const adminRole = await repo.findRoleByName('admin');
  if (!adminRole) throw new Error('Admin role not found in system');

  const existing = await repo.findUserRole(user._id, adminRole._id);
  if (!existing || !existing.active || existing.deleted) {
    throw new ConflictError('User is not an active admin');
  }

  await repo.updateUserRoleStatus(existing, false, true);
}

export async function getAdmins(
  paginationParams: PaginationParams
): Promise<PaginatedResponse<Record<string, unknown>, 'admins'>> {
  const adminRole = await repo.findRoleByName('admin');
  if (!adminRole) throw new Error('Admin role not found in system');

  return repo.findAdminsWithPagination(paginationParams, adminRole._id);
}
