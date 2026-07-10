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

/**
 * Block (disable) a user
 */
export const blockUser = async (id: string): Promise<IUser | null> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  return await userRepository.update(id, { isBlocked: true });
};

/**
 * Unblock (restore) a user
 */
export const unblockUser = async (id: string): Promise<IUser | null> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  return await userRepository.update(id, { isBlocked: false });
};
