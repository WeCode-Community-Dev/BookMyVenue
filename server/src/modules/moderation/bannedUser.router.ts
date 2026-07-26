import { Router } from 'express';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validateBody, validateParams } from '../../middlewares/validation.middleware';
import * as controller from './bannedUser.controller';
import * as validator from './bannedUser.validator';
import { z } from 'zod';

const router: Router = Router();

const banIdSchema = z.object({
  banId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ban ID'),
});

const userIdSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID'),
});

/**
 * @openapi
 * /moderation/bans:
 *   post:
 *     tags: [Moderation]
 *     summary: Create a ban
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, scope, reason]
 *             properties:
 *               userId:
 *                 type: string
 *               scope:
 *                 type: string
 *                 enum: [full, commenting, owner_dashboard, venue_creation]
 *               reason:
 *                 type: string
 *               venueId:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Ban created successfully
 */
router.post(
  '/',
  verifyAccessToken,
  requireRole('admin'),
  validateBody(validator.createBanSchema),
  controller.banUser
);

/**
 * @openapi
 * /moderation/bans/{banId}:
 *   delete:
 *     tags: [Moderation]
 *     summary: Lift a ban
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: banId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ban lifted successfully
 */
router.delete(
  '/:banId',
  verifyAccessToken,
  requireRole('admin'),
  validateParams(banIdSchema),
  controller.liftBan
);

/**
 * @openapi
 * /moderation/bans/user/{userId}:
 *   get:
 *     tags: [Moderation]
 *     summary: Get user ban history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User ban history
 */
router.get(
  '/user/:userId',
  verifyAccessToken,
  requireRole('admin'),
  validateParams(userIdSchema),
  controller.getUserBans
);

/**
 * @openapi
 * /moderation/bans/user/{userId}/lift-all:
 *   post:
 *     tags: [Moderation]
 *     summary: Lift all active bans for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All active bans lifted successfully
 */
router.post(
  '/user/:userId/lift-all',
  verifyAccessToken,
  requireRole('admin'),
  validateParams(userIdSchema),
  controller.liftAllBansForUser
);

export default router;
