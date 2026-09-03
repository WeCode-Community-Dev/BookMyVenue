import { Router } from 'express';
import type { Request, Response } from 'express';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { ResponseUtil } from '../../utils/responseUtils';
import { handleError } from '../../utils/errors';
import { getModerationSummary } from './moderation.service';
import { getModerationLogs } from './moderationActivity.service';
import bannedUserRouter from './bannedUser.router';

const router: Router = Router();

/**
 * @openapi
 * /moderation/summary:
 *   get:
 *     tags: [Moderation]
 *     summary: Get moderation dashboard summary (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Moderation summary with flagged reviews, suspended venues, banned users
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not admin
 */
router
  .route('/summary')
  .get(
    verifyAccessToken,
    requireRole('admin'),
    async (_req: Request, res: Response): Promise<void> => {
      try {
        const summary = await getModerationSummary();
        ResponseUtil.success(res, 'Moderation summary retrieved', summary);
      } catch (err) {
        handleError(res, err, 'getModerationSummary');
      }
    }
  );

/**
 * @openapi
 * /moderation/logs:
 *   get:
 *     tags: [Moderation]
 *     summary: Get moderation logs (admin and superAdmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of moderation logs with pagination info
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (requires admin)
 */
router
  .route('/logs')
  .get(
    verifyAccessToken,
    requireRole('admin'),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const { logs, total } = await getModerationLogs(page, limit);
        ResponseUtil.success(res, 'Moderation logs retrieved', {
          logs,
          pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        });
      } catch (err) {
        handleError(res, err, 'getModerationLogs');
      }
    }
  );

router.use('/bans', bannedUserRouter);

export { router as moderationRouter };
