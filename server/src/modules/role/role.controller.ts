import type { Request, Response } from 'express';
import { ResponseUtil } from '../../utils/responseUtils';
import { handleError } from '../../utils/errors';
import * as service from './role.service';

export const roleController = {
  promoteToAdmin: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.validated?.body as { email: string };
      await service.promoteToAdmin(email);
      ResponseUtil.success(res, 'User promoted to admin successfully');
    } catch (e) {
      handleError(res, e, 'promoteToAdmin');
    }
  },

  demoteAdmin: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.validated?.body as { userId: string };
      await service.demoteAdmin(userId);
      ResponseUtil.success(res, 'Admin demoted successfully');
    } catch (e) {
      handleError(res, e, 'demoteAdmin');
    }
  },

  getAdmins: async (req: Request, res: Response): Promise<void> => {
    try {
      const paginationParams = req.pagination ?? {
        page: 1,
        limit: 10,
        skip: 0,
        sort: '-createdAt',
      };
      const result = await service.getAdmins(paginationParams);
      ResponseUtil.success(res, 'Admins retrieved successfully', result);
    } catch (e) {
      handleError(res, e, 'getAdmins');
    }
  },
};
