import { Router } from 'express';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { PERMISSIONS as P } from '../../constants/permissions';
import { paginationMiddleware } from '../../middlewares/pagination.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
import * as validator from './wishlist.validator';
import * as controller from './wishlist.controller';

const router: Router = Router();

/**
 * @openapi
 * /wishlist/toggle/{venueId}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Toggle a venue in user's wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist toggled successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Venue not found
 */
router
  .route('/toggle/:venueId')
  .post(verifyAccessToken, requirePermission(P.wishlist.create), controller.toggleWishlist);

/**
 * @openapi
 * /wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get user's wishlist (paginated)
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
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Not authenticated
 */
router
  .route('/')
  .get(
    verifyAccessToken,
    requirePermission(P.wishlist.read),
    paginationMiddleware(),
    controller.getMyWishlist
  );

/**
 * @openapi
 * /wishlist/status:
 *   get:
 *     tags: [Wishlist]
 *     summary: Check wishlist status for multiple venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: venueIds
 *         schema:
 *           type: string
 *         description: Comma-separated venue IDs (max 100)
 *     responses:
 *       200:
 *         description: Wishlist statuses for requested venues
 *       401:
 *         description: Not authenticated
 */
router
  .route('/status')
  .get(verifyAccessToken, requirePermission(P.wishlist.read), controller.getWishlistStatus);

/**
 * @openapi
 * /wishlist/sync:
 *   post:
 *     tags: [Wishlist]
 *     summary: Merge a guest's locally-stored wishlist into the user's account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [venueIds]
 *             properties:
 *               venueIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Wishlist synced successfully
 *       401:
 *         description: Not authenticated
 */
router
  .route('/sync')
  .post(
    verifyAccessToken,
    requirePermission(P.wishlist.create),
    validateBody(validator.syncWishlistBodySchema),
    controller.syncWishlist
  );

export { router as wishlistRouter };
