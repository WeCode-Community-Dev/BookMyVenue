import { Router } from 'express';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { requireSuperAdmin } from '../../middlewares/rbac.middleware';
import { rbacController } from './rbac.controller';

const router: Router = Router();

/**
 * @openapi
 * /rbac/cache:
 *   get:
 *     tags: [RBAC]
 *     summary: Get permission cache statistics (super-admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cache stats — hit rate, size, entries
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: integer
 *                         entries:
 *                           type: array
 *                           items:
 *                             type: string
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Super-admin role required
 *   delete:
 *     tags: [RBAC]
 *     summary: Clear the entire permission cache (super-admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permission cache cleared
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Super-admin role required
 */
router
  .route('/cache')
  .get(verifyAccessToken, requireSuperAdmin, rbacController.getCacheStats)
  .delete(verifyAccessToken, requireSuperAdmin, rbacController.clearCache);

/**
 * @openapi
 * /rbac/cache/{roleId}:
 *   delete:
 *     tags: [RBAC]
 *     summary: Invalidate the permission cache for a specific role (super-admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         description: MongoDB ObjectId of the role whose cache entry should be cleared
 *         schema:
 *           type: string
 *           example: 64b1f2c3d4e5f6a7b8c9d0e3
 *     responses:
 *       200:
 *         description: Cache entry invalidated for the role
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Super-admin role required
 *       404:
 *         description: Role not found in cache
 */
router
  .route('/cache/:roleId')
  .delete(verifyAccessToken, requireSuperAdmin, rbacController.invalidateRoleCache);

export { router as rbacRouter };
