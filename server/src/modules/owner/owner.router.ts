import { Router } from 'express';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { ownerTenantMiddleware } from '../../middlewares/ownerTenant.middleware';
import { validateBody, validateParams } from '../../middlewares/validation.middleware';
import { paginationMiddleware } from '../../middlewares/pagination.middleware';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware';
import { PERMISSIONS as P } from '../../constants/permissions';
import * as controller from './owner.controller';
import * as validator from './owner.validator';

const router: Router = Router();

/**
 * @openapi
 * /owner/analytics/{venueId}:
 *   get:
 *     tags: [Owner]
 *     summary: Get analytics for a specific venue
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
 *         description: Venue analytics data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.get(
  '/analytics/:venueId',
  verifyAccessToken,
  requirePermission(P.venues.read),
  validateParams(validator.analyticsParamsSchema),
  ownerTenantMiddleware,
  controller.getVenueAnalytics
);

/**
 * @openapi
 * /owner/{venueId}/block-dates:
 *   post:
 *     tags: [Owner]
 *     summary: Block dates for a venue
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dates]
 *             properties:
 *               dates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                   example: '2025-12-25'
 *                 description: Array of dates to block (YYYY-MM-DD, up to 6 months ahead)
 *     responses:
 *       200:
 *         description: Dates blocked successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/:venueId/block-dates',
  verifyAccessToken,
  requirePermission(P.venues.update),
  validateParams(validator.analyticsParamsSchema),
  validateBody(validator.blockDatesSchema),
  ownerTenantMiddleware,
  controller.blockDates
);

/**
 * @openapi
 * /owner/{venueId}/unblock-dates:
 *   post:
 *     tags: [Owner]
 *     summary: Unblock dates for a venue
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dates]
 *             properties:
 *               dates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                   example: '2025-12-25'
 *                 description: Array of dates to unblock (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Dates unblocked successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/:venueId/unblock-dates',
  verifyAccessToken,
  requirePermission(P.venues.update),
  validateParams(validator.analyticsParamsSchema),
  validateBody(validator.unblockDatesSchema),
  ownerTenantMiddleware,
  controller.unblockDates
);

/**
 * @openapi
 * /owner/venue/{venueId}/bookings:
 *   get:
 *     tags: [Owner]
 *     summary: Get all bookings for a specific venue
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
 *         description: List of venue bookings
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.get(
  '/venue/:venueId/bookings',
  verifyAccessToken,
  requirePermission(P.bookings.read),
  validateParams(validator.analyticsParamsSchema),
  ownerTenantMiddleware,
  paginationMiddleware(),
  controller.getVenueBookings
);

/**
 * @openapi
 * /owner/venue/{venueId}/availability-calendar:
 *   get:
 *     tags: [Owner]
 *     summary: Get availability calendar for a venue
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Availability calendar data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.get(
  '/venue/:venueId/availability-calendar',
  verifyAccessToken,
  requirePermission(P.venues.read),
  validateParams(validator.analyticsParamsSchema),
  ownerTenantMiddleware,
  controller.getVenueAvailabilityCalendar
);

/**
 * @openapi
 * /owner/bookings/offline:
 *   post:
 *     tags: [Owner]
 *     summary: Create an offline booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [venueId, date, startTime, endTime, customerName, customerPhone]
 *             properties:
 *               venueId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: integer
 *               endTime:
 *                 type: integer
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Offline booking created successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/bookings/offline',
  verifyAccessToken,
  requirePermission(P.bookings.create),
  validateBody(validator.offlineBookingSchema),
  ownerTenantMiddleware,
  controller.createOfflineBooking
);

/**
 * @openapi
 * /owner/venue/{venueId}/reviews:
 *   get:
 *     tags: [Owner]
 *     summary: Get reviews for a specific venue (owner only)
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: Not the venue owner
 */
router.get(
  '/venue/:venueId/reviews',
  verifyAccessToken,
  requirePermission(P.reviews.read),
  validateParams(validator.analyticsParamsSchema),
  ownerTenantMiddleware,
  paginationMiddleware(),
  controller.getVenueReviews
);

/**
 * @openapi
 * /owner/venue/{venueId}/reviews/{reviewId}/reply:
 *   post:
 *     tags: [Owner]
 *     summary: Reply to a review (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Reply added successfully
 *       403:
 *         description: Not the venue owner
 */
router.post(
  '/venue/:venueId/reviews/:reviewId/reply',
  verifyAccessToken,
  requirePermission(P.reviews.update),
  validateParams(validator.reviewParamsSchema),
  validateBody(validator.ownerReplySchema),
  ownerTenantMiddleware,
  controller.replyToReview
);

/**
 * @openapi
 * /owner/venue/{venueId}/reviews/{reviewId}/report:
 *   post:
 *     tags: [Owner]
 *     summary: Report a review to admin for hiding (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Report submitted to admin
 *       403:
 *         description: Not the venue owner
 *       409:
 *         description: Hide request already pending
 */
router.post(
  '/venue/:venueId/reviews/:reviewId/report',
  verifyAccessToken,
  requirePermission(P.reviews.update),
  validateParams(validator.reviewParamsSchema),
  validateBody(validator.reportReviewSchema),
  ownerTenantMiddleware,
  controller.reportReview
);

/**
 * @openapi
 * /owner/venue/{venueId}/settings:
 *   get:
 *     tags: [Owner]
 *     summary: Get venue settings
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
 *         description: Venue settings data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.get(
  '/venue/:venueId/settings',
  verifyAccessToken,
  requirePermission(P.venues.read),
  validateParams(validator.analyticsParamsSchema),
  ownerTenantMiddleware,
  controller.getVenueSettings
);

/**
 * @openapi
 * /owner/venue/{venueId}/request-inactivity:
 *   post:
 *     tags: [Owner]
 *     summary: Request venue inactivity (requires admin approval)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inactivity request submitted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/venue/:venueId/request-inactivity',
  verifyAccessToken,
  requirePermission(P.venues.update),
  validateParams(validator.analyticsParamsSchema),
  validateBody(validator.inactivityRequestSchema),
  ownerTenantMiddleware,
  idempotencyMiddleware(),
  controller.requestInactivity
);

/**
 * @openapi
 * /owner/venue/{venueId}/request-inactivity:
 *   delete:
 *     tags: [Owner]
 *     summary: Withdraw inactivity request
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
 *         description: Inactivity request withdrawn
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.delete(
  '/venue/:venueId/request-inactivity',
  verifyAccessToken,
  requirePermission(P.venues.update),
  validateParams(validator.analyticsParamsSchema),
  ownerTenantMiddleware,
  idempotencyMiddleware(),
  controller.withdrawInactivity
);

/**
 * @openapi
 * /owner/venue/{venueId}/block-bookings:
 *   post:
 *     tags: [Owner]
 *     summary: Block bookings for a venue (no approval needed)
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
 *         description: Bookings blocked successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/venue/:venueId/block-bookings',
  verifyAccessToken,
  requirePermission(P.venues.update),
  validateParams(validator.analyticsParamsSchema),
  ownerTenantMiddleware,
  idempotencyMiddleware(),
  controller.blockBookings
);

/**
 * @openapi
 * /owner/venue/{venueId}/block-bookings:
 *   delete:
 *     tags: [Owner]
 *     summary: Remove temporary booking block
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
 *         description: Booking block removed
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.delete(
  '/venue/:venueId/block-bookings',
  verifyAccessToken,
  requirePermission(P.venues.update),
  validateParams(validator.analyticsParamsSchema),
  ownerTenantMiddleware,
  idempotencyMiddleware(),
  controller.unblockBookings
);

/**
 * @openapi
 * /owner/venue/{venueId}/activate:
 *   post:
 *     tags: [Owner]
 *     summary: Reactivate venue from Inactive to Approved
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
 *         description: Venue reactivated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/venue/:venueId/activate',
  verifyAccessToken,
  requirePermission(P.venues.update),
  validateParams(validator.analyticsParamsSchema),
  ownerTenantMiddleware,
  idempotencyMiddleware(),
  controller.activateVenue
);

/**
 * @openapi
 * /owner/venue/{venueId}/delete-request:
 *   post:
 *     tags: [Owner]
 *     summary: Request venue deletion (requires admin approval)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Deletion request submitted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/venue/:venueId/delete-request',
  verifyAccessToken,
  requirePermission(P.venues.update),
  validateParams(validator.analyticsParamsSchema),
  validateBody(validator.deleteRequestSchema),
  ownerTenantMiddleware,
  idempotencyMiddleware(),
  controller.requestDeleteVenue
);

/**
 * @openapi
 * /owner/bookings/{bookingId}/mark-paid:
 *   patch:
 *     tags: [Owner]
 *     summary: Mark an offline booking as paid
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking marked as paid
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Booking not found
 */
router
  .route('/bookings/:bookingId/mark-paid')
  .patch(
    verifyAccessToken,
    requirePermission(P.bookings.update),
    ownerTenantMiddleware,
    controller.markBookingAsPaid
  );

/**
 * @openapi
 * /owner/bookings/{bookingId}/cancel-pending:
 *   patch:
 *     tags: [Owner]
 *     summary: Cancel a pending offline booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pending offline booking cancelled
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Booking not found
 */
router
  .route('/bookings/:bookingId/cancel-pending')
  .patch(
    verifyAccessToken,
    requirePermission(P.bookings.update),
    ownerTenantMiddleware,
    controller.cancelPendingOfflineBooking
  );

export default router;
