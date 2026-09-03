import type { NextFunction, Request, Response } from 'express';
import { ResponseUtil } from '../utils/responseUtils';
import { getUserRole } from '../services/roles.service';
import { getPerms } from '../services/cache/permission-cache.service';
import type { IPermission } from '../constants/permissions';
import { ROLE_HIERARCHY } from '../constants/permissions';
import { logWarn, logError } from '../utils/logger';

export const loadPermissions = async (req: Request, res: Response): Promise<boolean> => {
  const { user } = req;

  if (!user?.userId) {
    ResponseUtil.unauthorized(res, 'Unauthorized');
    return false;
  }

  if (user.role.permissions) return true;

  const { userId } = user;

  const userRole =
    user.role.id && user.role.name
      ? { roleId: user.role.id, roleName: user.role.name }
      : await getUserRole(userId);

  if (!userRole) {
    ResponseUtil.unauthorized(res, 'Unauthorized');
    return false;
  }

  user.role.id = userRole.roleId;
  user.role.name = userRole.roleName;

  const permissions = await getPerms(userRole.roleId, userRole.roleName);

  user.role.permissions = new Set<IPermission>(permissions);
  user.role.isSuperAdmin = userRole.roleName === 'superAdmin';

  return true;
};

export const requirePermission = (...required: IPermission[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    try {
      const loaded = await loadPermissions(req, res);
      if (!loaded) return;

      // superAdmin always bypasses
      if (req.user?.role.isSuperAdmin) {
        next();
        return;
      }

      const userPerms = req.user?.role.permissions;

      if (!userPerms) {
        logWarn('requirePermission: user has no permissions', { userId, path: req.path });
        ResponseUtil.unauthorized(res, 'Unauthorized');
        return;
      }

      const permitted = required.every((p) => userPerms.has(p));

      if (!permitted) {
        logWarn('requirePermission: access denied', {
          userId,
          required,
          path: req.path,
          method: req.method,
        });
        ResponseUtil.forbidden(res, 'Forbidden');
        return;
      }

      next();
    } catch (e) {
      const error = e as Error;
      logError('requirePermission: unexpected error', {
        module: 'rbac.middleware.ts/requirePermission',
        error: error.message,
        userId,
      });
      ResponseUtil.internalServerError(res, 'Server error');
    }
  };
};

export const requireSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    ResponseUtil.unauthorized(res, 'Unauthorized');
    return;
  }

  try {
    const loaded = await loadPermissions(req, res);
    if (!loaded) return;

    if (!req.user?.role.isSuperAdmin) {
      logWarn('requireSuperAdmin: access denied', { userId, path: req.path });
      ResponseUtil.forbidden(res, 'Forbidden');
      return;
    }

    next();
  } catch (e) {
    const error = e as Error;
    logError('requireSuperAdmin: unexpected error', {
      module: 'rbac.middleware.ts/requireSuperAdmin',
      error: error.message,
      userId,
    });
    ResponseUtil.internalServerError(res, 'Server error');
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    try {
      const loaded = await loadPermissions(req, res);
      if (!loaded) return;

      const roleName = req.user?.role.name;

      if (!roleName) {
        logWarn('requireRole: user has no role', { userId, path: req.path });
        ResponseUtil.forbidden(res, 'Forbidden');
        return;
      }

      if (req.user?.role.isSuperAdmin) {
        next();
        return;
      }

      const userHierarchy = ROLE_HIERARCHY[roleName] ?? [roleName];
      const permitted = allowedRoles.some((r) => userHierarchy.includes(r));

      if (!permitted) {
        logWarn('requireRole: access denied', {
          userId,
          roleName,
          allowedRoles,
          path: req.path,
          method: req.method,
        });
        ResponseUtil.forbidden(res, 'Forbidden');
        return;
      }

      next();
    } catch (e) {
      const error = e as Error;
      logError('requireRole: unexpected error', {
        module: 'rbac.middleware.ts/requireRole',
        error: error.message,
        userId,
      });
      ResponseUtil.internalServerError(res, 'Server error');
    }
  };
};
