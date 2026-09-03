import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../../middlewares/validation.middleware';
import { verifyAccessToken, verifyAccessTokenOptional } from '../../middlewares/auth.middleware';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { PERMISSIONS as P } from '../../constants/permissions';
import { venueIdParamSchema } from '../venue/venue.validator';
import { blockSlotBodySchema } from '../booking/booking.validator';
import * as bookingController from '../booking/booking.controller';
import * as availabilityController from './availability.controller';
import { availabilityQuerySchema } from './availability.validator';

const router: ExpressRouter = Router();

/**
 * @openapi
 * /availability/{id}:
 *   get:
 *     tags: [Availability]
 *     summary: Get venue availability slots for a given date range
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Venue MongoDB ObjectId
 *         schema:
 *           type: string
 *           example: 64b1f2c3d4e5f6a7b8c9d0e1
 *       - in: query
 *         name: date
 *         required: false
 *         description: Target date in YYYY-MM-DD format. If omitted, returns bookable dates for the venue.
 *         schema:
 *           type: string
 *           example: '2025-12-25'
 *     responses:
 *       200:
 *         description: Availability grid or bookable dates metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid venue ID or date format
 *       404:
 *         description: Venue not found
 */
router
  .route('/:id')
  .get(
    verifyAccessTokenOptional,
    validateParams(venueIdParamSchema),
    validateQuery(availabilityQuerySchema),
    availabilityController.getVenueAvailability
  );

/**
 * @openapi
 * /availability/{id}/block:
 *   post:
 *     tags: [Availability]
 *     summary: Block a time slot for a venue (Step 1 of 3 in the booking flow)
 *     description: |
 *       Acquires a time-limited DB lock on the requested slot.
 *       Does NOT create a Razorpay order — that happens in Step 2 (`/bookings/checkout`).
 *       Lock expires automatically if checkout is not initiated within the window.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Venue MongoDB ObjectId
 *         schema:
 *           type: string
 *           example: 64b1f2c3d4e5f6a7b8c9d0e1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, startTime, endTime, expectedPrice]
 *             properties:
 *               date:
 *                 type: string
 *                 description: Booking date in YYYY-MM-DD
 *                 example: '2025-12-25'
 *               startTime:
 *                 type: integer
 *                 description: Slot start in minutes from midnight (0–1439)
 *                 example: 600
 *               endTime:
 *                 type: integer
 *                 description: Slot end in minutes from midnight (1–1440)
 *                 example: 720
 *               expectedPrice:
 *                 type: number
 *                 description: Client-calculated price in rupees for server sanity check
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Slot locked — returns lock ID for use in checkout
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
 *                         lockId:
 *                           type: string
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Slot unavailable or validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       409:
 *         description: Slot already locked by another user
 */
router
  .route('/:id/block')
  .post(
    verifyAccessToken,
    idempotencyMiddleware(),
    requirePermission(P.bookings.create),
    validateParams(venueIdParamSchema),
    validateBody(blockSlotBodySchema),
    bookingController.blockSlot
  );

/**
 * @openapi
 * /availability/lock:
 *   delete:
 *     tags: [Availability]
 *     summary: Release a slot lock
 *     description: Manually release a lock before it expires
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lock released successfully
 *       401:
 *         description: Not authenticated
 */
router.route('/lock').delete(verifyAccessTokenOptional, bookingController.releaseLock);

export { router as availabilityRouter };
