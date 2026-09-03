import { Router } from 'express';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { requireRole, requirePermission } from '../../middlewares/rbac.middleware';
import { PERMISSIONS as P } from '../../constants/permissions';
import { paginationMiddleware } from '../../middlewares/pagination.middleware';
import { validateBody, validateParams } from '../../middlewares/validation.middleware';
import { moderateReviewSchema, moderateReviewParamsSchema } from './review.validator';
import * as controller from './review.controller';

const router: Router = Router();

/**
 * @openapi
 * /reviews/venue/{venueId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews for a venue (public)
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Reviews for the venue
 *   post:
 *     tags: [Reviews]
 *     summary: Submit a rating and/or comment for a venue
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       401:
 *         description: Not authenticated
 */
router
  .route('/venue/:venueId')
  .get(paginationMiddleware(), controller.getVenueReviews)
  .post(verifyAccessToken, requirePermission(P.reviews.create), controller.submitReview);

/**
 * @openapi
 * /reviews/venue/{venueId}/my-rating:
 *   get:
 *     tags: [Reviews]
 *     summary: Get my rating for a venue
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
 *         description: My rating
 */
router.route('/venue/:venueId/my-rating').get(verifyAccessToken, controller.getMyRating);

/**
 * @openapi
 * /reviews/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update a review (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Review not found
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Review not found
 */
router
  .route('/:id')
  .patch(verifyAccessToken, requirePermission(P.reviews.update), controller.updateReview)
  .delete(verifyAccessToken, requirePermission(P.reviews.delete), controller.deleteReview);

/**
 * @openapi
 * /reviews/moderation/flagged:
 *   get:
 *     tags: [Reviews]
 *     summary: Get flagged/removed reviews (admin only)
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
 *         description: Flagged reviews
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router
  .route('/moderation/flagged')
  .get(
    verifyAccessToken,
    requireRole('admin'),
    paginationMiddleware(),
    controller.getFlaggedReviews
  );

/**
 * @openapi
 * /reviews/{id}/moderate:
 *   post:
 *     tags: [Reviews]
 *     summary: Moderate a review (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [flag, remove, restore, approve_hide, reject_hide]
 *               reason:
 *                 type: string
 *                 minLength: 10
 *             examples:
 *               remove:
 *                 summary: Remove a review
 *                 value:
 *                   action: remove
 *                   reason: Inappropriate content detected
 *     responses:
 *       200:
 *         description: Review moderated successfully
 *       400:
 *         description: Invalid action or missing/invalid reason
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Review not found
 */
router
  .route('/:id/moderate')
  .post(
    verifyAccessToken,
    requireRole('admin'),
    validateParams(moderateReviewParamsSchema),
    validateBody(moderateReviewSchema),
    controller.moderateReview
  );

export { router as reviewRouter };
