import type { Request, Response } from 'express';
import { ResponseUtil } from '../../utils/responseUtils';
import * as service from './rbac.service';

export const rbacController = {
  getCacheStats: (_req: Request, res: Response): void => {
    const stats = service.getCacheStats();
    ResponseUtil.success(res, 'Cache stats retrieved', {
      totalRoles: stats.size,
      totalPermissions: stats.entries.reduce((sum, entry) => sum + entry.permissionCount, 0),
      roles: stats.entries,
    });
  },

  clearCache: (_req: Request, res: Response): void => {
    service.clearCache();
    ResponseUtil.success(res, 'Permission cache cleared');
  },

  invalidateRoleCache: (req: Request, res: Response): void => {
    service.invalidateRoleCache(String(req.params.roleId));
    ResponseUtil.success(res, `Cache invalidated for role ${String(req.params.roleId)}`);
  },
};
