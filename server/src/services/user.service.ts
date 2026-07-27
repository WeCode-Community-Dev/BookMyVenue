import { userRepository } from '@/repositories/user.repository';
import { getAllUsersDto } from '@/dto/user/getAllUsers.dto';
import { IUser } from '@/models/interfaces/user-scheme.interface';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';

/**
 * Get all users with filters, search, sorting, and pagination
 */
export const getAllUsers = async (
  query: getAllUsersDto
): Promise<{ users: IUser[]; totalUsers: number }> => {
  return await userRepository.getAllUsers(query);
};

/**
 * Get a single user by ID
 */
export const getUserById = async (id: string): Promise<IUser> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  return user;
};

import Venue from '@/models/venue.model';

/**
 * Block (disable) a user
 */
export const blockUser = async (id: string, adminId?: string): Promise<IUser | null> => {
  // V-005: Prevent admin from blocking themselves
  if (adminId && adminId === id) {
    throw new AppError('You cannot block your own account', HTTP_STATUS.FORBIDDEN);
  }

  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // V-005: Prevent admin from blocking another admin account
  if (user.role === 'admin') {
    throw new AppError('Admin accounts cannot be blocked or unblocked via this endpoint', HTTP_STATUS.FORBIDDEN);
  }

  const updatedUser = await userRepository.update(id, { isBlocked: true });

  // If the user is an owner, deactivate all their venue listings
  if (user.role === 'owner') {
    await Venue.updateMany(
      { ownerId: id },
      { $set: { isActive: false, verificationStatus: 'rejected' } }
    );
  }

  return updatedUser;
};

/**
 * Unblock (restore) a user
 */
export const unblockUser = async (id: string, adminId?: string): Promise<IUser | null> => {
  // V-005: Prevent admin from unblocking themselves (no-op, but consistent guard)
  if (adminId && adminId === id) {
    throw new AppError('You cannot modify your own account block status', HTTP_STATUS.FORBIDDEN);
  }

  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // V-005: Admin accounts are never blocked
  if (user.role === 'admin') {
    throw new AppError('Admin accounts cannot be blocked or unblocked via this endpoint', HTTP_STATUS.FORBIDDEN);
  }

  return await userRepository.update(id, { isBlocked: false });
};
