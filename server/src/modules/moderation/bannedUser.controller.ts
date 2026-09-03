import type { Request, Response } from 'express';
import { ResponseUtil } from '../../utils/responseUtils';
import { handleError } from '../../utils/errors';
import * as service from '../moderation/bannedUser.service';
import type { CreateBanRequest } from './bannedUser.types';

export const banUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const { userId, scope, reason, venueId, expiresAt } = req.body as CreateBanRequest;

    const ban = await service.banUser(adminId, userId, scope, reason, {
      venueId: venueId ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    ResponseUtil.created(res, 'User banned successfully', ban);
  } catch (e) {
    handleError(res, e, 'banUser');
  }
};

export const liftBan = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const banId = Array.isArray(req.params.banId) ? req.params.banId[0] : req.params.banId;

    const ban = await service.liftBan(adminId, banId);
    ResponseUtil.success(res, 'Ban lifted successfully', ban);
  } catch (e) {
    handleError(res, e, 'liftBan');
  }
};

export const liftAllBansForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

    const count = await service.liftAllBansForUser(adminId, userId);
    ResponseUtil.success(res, 'All active bans lifted successfully', { liftedCount: count });
  } catch (e) {
    handleError(res, e, 'liftAllBansForUser');
  }
};

export const getUserBans = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

    const bans = await service.getUserBanHistory(userId);
    ResponseUtil.success(res, 'User ban history retrieved', { bans });
  } catch (e) {
    handleError(res, e, 'getUserBans');
  }
};
