import { Router } from 'express';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { requireSuperAdmin } from '../../middlewares/rbac.middleware';
import { validateBody, validateQuery } from '../../middlewares/validation.middleware';
import { paginationMiddleware } from '../../middlewares/pagination.middleware';
import * as validator from './role.validator';
import { roleController } from './role.controller';

const router: Router = Router();

/**
 * @openapi
 * /role/promote:
 *   post:
 *     tags: [Role]
 *     summary: Promote a user to admin (super-admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User promoted
 */
router
  .route('/promote')
  .post(
    verifyAccessToken,
    requireSuperAdmin,
    validateBody(validator.promoteUserSchema),
    roleController.promoteToAdmin
  );

/**
 * @openapi
 * /role/demote:
 *   post:
 *     tags: [Role]
 *     summary: Demote an admin (super-admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin demoted
 */
router
  .route('/demote')
  .post(
    verifyAccessToken,
    requireSuperAdmin,
    validateBody(validator.demoteUserSchema),
    roleController.demoteAdmin
  );

/**
 * @openapi
 * /role/admins:
 *   get:
 *     tags: [Role]
 *     summary: List all admins (super-admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of admins
 */
router
  .route('/admins')
  .get(
    verifyAccessToken,
    requireSuperAdmin,
    validateQuery(validator.getAdminsQuerySchema),
    paginationMiddleware(),
    roleController.getAdmins
  );

export { router as roleRouter };
