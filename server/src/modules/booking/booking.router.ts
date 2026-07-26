import { Router } from 'express';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware';
import { requireRole, requirePermission } from '../../middlewares/rbac.middleware';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../../middlewares/validation.middleware';
import { PERMISSIONS as P } from '../../constants/permissions';
import {
  checkoutBodySchema,
  verifyPaymentBodySchema,
  fetchMyBookingsQuerySchema,
  saveBookerDetailsBodySchema,
  bookingRefIdParamSchema,
  adminBookingFiltersSchema,
} from './booking.validator';
import * as controller from './booking.controller';
import { paginationMiddleware } from '../../middlewares/pagination.middleware';

const router: Router = Router();

/**
 * @openapi
 * /bookings/checkout:
 *   post:
 *     tags: [Bookings]
 *     summary: Initiate checkout — create a Razorpay order (Step 2 of 3)
 *     description: |
 *       Validates the slot lock is still alive and within the buffer window,
 *       then creates a Razorpay order. Requires a valid `lockId` from Step 1.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lockId]
 *             properties:
 *               lockId:
 *                 type: string
 *                 description: MongoDB ObjectId returned from /availability/:id/block
 *                 example: 64b1f2c3d4e5f6a7b8c9d0e2
 *     responses:
 *       200:
 *         description: Razorpay order created — return order ID to client for payment
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
 *                         orderId:
 *                           type: string
 *                         amount:
 *                           type: integer
 *                           description: Amount in paise
 *                         currency:
 *                           type: string
 *                           example: INR
 *       400:
 *         description: Invalid lockId or lock expired
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       409:
 *         description: Lock no longer valid or slot taken
 */
router
  .route('/checkout')
  .post(
    verifyAccessToken,
    idempotencyMiddleware(),
    requirePermission(P.bookings.create),
    validateBody(checkoutBodySchema),
    controller.initCheckout
  );

/**
 * @openapi
 * /bookings/booker-details:
 *   patch:
 *     tags: [Bookings]
 *     summary: Save booker details before checkout
 *     description: Save booker info into the lock
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lockId, guestCount, eventType, bookerInfo]
 *             properties:
 *               lockId:
 *                 type: string
 *                 description: MongoDB ObjectId from slot block
 *               guestCount:
 *                 type: integer
 *                 description: Number of guests attending
 *               eventType:
 *                 type: string
 *                 description: Type of event (e.g. wedding, corporate)
 *               bookerInfo:
 *                 type: object
 *                 required: [name, email, phone, place]
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   phone:
 *                     type: string
 *                   place:
 *                     type: string
 *                   note:
 *                     type: string
 *     responses:
 *       200:
 *         description: Booker details saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 */
router
  .route('/booker-details')
  .patch(
    verifyAccessToken,
    validateBody(saveBookerDetailsBodySchema),
    controller.saveBookerDetails
  );

/**
 * @openapi
 * /bookings/verify-payment:
 *   post:
 *     tags: [Bookings]
 *     summary: Verify Razorpay payment signature (Step 3 of 3)
 *     description: |
 *       Client-side verification step called after the Razorpay payment modal closes.
 *       The server re-verifies the HMAC signature before confirming the booking.
 *       Final booking creation is triggered by the Razorpay webhook automatically.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, paymentId, signature]
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: order_OIBFHxxx
 *               paymentId:
 *                 type: string
 *                 example: pay_OIBFHyyy
 *               signature:
 *                 type: string
 *                 example: abc123hmac
 *     responses:
 *       200:
 *         description: Payment signature verified
 *       400:
 *         description: Invalid or mismatched signature
 *       401:
 *         description: Not authenticated
 */
router
  .route('/verify-payment')
  .post(
    verifyAccessToken,
    requirePermission(P.bookings.create),
    validateBody(verifyPaymentBodySchema),
    controller.verifyPayment
  );

/**
 * @openapi
 * /bookings/my-bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: Get all bookings for the authenticated user (grouped by status)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 *       401:
 *         description: Not authenticated
 */
router
  .route('/my-bookings')
  .get(verifyAccessToken, validateQuery(fetchMyBookingsQuerySchema), controller.getMyBookings);

/**
 * @openapi
 * /bookings/all:
 *   get:
 *     tags: [Bookings]
 *     summary: Get all bookings across all venues (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmed, pending, cancelled, completed]
 *       - in: query
 *         name: venueId
 *         schema:
 *           type: string
 *         description: Filter by venue (MongoDB ObjectId)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort order field
 *     responses:
 *       200:
 *         description: Paginated list of all bookings
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 */
router
  .route('/all')
  .get(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.bookings.read),
    validateQuery(adminBookingFiltersSchema),
    paginationMiddleware(),
    controller.getAllBookings
  );

/**
 * @openapi
 * /bookings/{bookingRefId}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get a booking by its reference ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingRefId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Booking not found
 *   delete:
 *     tags: [Bookings]
 *     summary: Cancel a booking by its reference ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingRefId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Booking not found
 */
router
  .route('/:bookingRefId')
  .all(verifyAccessToken, validateParams(bookingRefIdParamSchema))
  .get(requirePermission(P.bookings.read), controller.getBookingById)
  .delete(requirePermission(P.bookings.delete), controller.cancelBooking);

export { router as bookingRouter };
