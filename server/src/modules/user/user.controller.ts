import type { Request, Response } from 'express';
import type { z } from 'zod';
import { ResponseUtil } from '../../utils/responseUtils';
import * as service from './user.service';
import * as workflow from './user.workflow';
import { handleError } from '../../utils/errors';
import type { updateProfileSchema } from './user.validator';
import type { BanUserRequest } from './user.types';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const profile = await service.getProfile(userId);
    ResponseUtil.success(res, 'User profile retrieved successfully', profile);
  } catch (e) {
    handleError(res, e, 'getProfile');
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const dto = req.validated?.body as z.infer<typeof updateProfileSchema>;
    const profile = await service.updateProfile(userId, dto);
    ResponseUtil.success(res, 'Profile updated successfully', profile);
  } catch (e) {
    handleError(res, e, 'updateProfile');
  }
};

export const deleteProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const profile = await service.deleteProfilePicture(userId);
    ResponseUtil.success(res, 'Profile picture removed successfully', profile);
  } catch (e) {
    handleError(res, e, 'deleteProfilePicture');
  }
};

export const getAvatarUploadSignature = (req: Request, res: Response): void => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const signed = service.getAvatarUploadSignature(userId);
    if (!signed) {
      ResponseUtil.internalServerError(res, 'Image upload not configured');
      return;
    }

    ResponseUtil.success(res, 'Signature generated', signed);
  } catch (e) {
    handleError(res, e, 'getAvatarUploadSignature');
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const paginationParams = req.pagination ?? { page: 1, limit: 10, skip: 0, sort: '-createdAt' };
    const role = req.query.role as string | undefined;

    const result = await service.getAllUsers(paginationParams, { role });
    ResponseUtil.success(res, 'Users retrieved successfully', result);
  } catch (e) {
    handleError(res, e, 'getAllUsers');
  }
};

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Prevent modifying own status
    if (req.user?.userId === userId) {
      ResponseUtil.badRequest(res, 'You cannot toggle your own status');
      return;
    }
    const user = await service.toggleUserStatus(userId as string);
    if (!user) {
      ResponseUtil.notFound(res, 'User not found');
      return;
    }

    ResponseUtil.success(res, `User is now ${user.active ? 'active' : 'inactive'}`, {
      active: user.active,
    });
  } catch (e) {
    handleError(res, e, 'toggleUserStatus');
  }
};

export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    await workflow.resetUserPasswordWorkflow(userId as string);

    ResponseUtil.success(res, 'Password reset successfully, email dispatched');
  } catch (e) {
    const error = e as Error;
    if (error.message.includes('not found')) {
      ResponseUtil.notFound(res, error.message);
    } else {
      handleError(res, e, 'resetUserPassword');
    }
  }
};

export const banUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const { banReason } = req.body as BanUserRequest;

    if (!banReason || banReason.trim().length < 10) {
      ResponseUtil.badRequest(res, 'Ban reason must be at least 10 characters');
      return;
    }

    const user = await service.banUser(userId, adminId, banReason);
    ResponseUtil.success(res, 'User banned successfully', {
      username: user.username,
      isBanned: user.isBanned,
    });
  } catch (e) {
    handleError(res, e, 'banUser');
  }
};

export const unbanUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const user = await service.unbanUser(userId);
    ResponseUtil.success(res, 'User unbanned successfully', { username: user.username });
  } catch (e) {
    handleError(res, e, 'unbanUser');
  }
};
