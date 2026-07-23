/**
 * Bookings API documentation (OpenAPI).
 * Keep route/controller files free of Swagger comments.
 *
 * Note: Booking creation is not handled under /api/bookings.
 * Bookings are created via the Payments module (payment verification).
 */

/**
 * @openapi
 * /api/bookings/my-bookings:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: List my bookings
 *     description: >
 *       Returns all bookings for the authenticated user, sorted by newest first.
 *       Each booking populates `venueId` and `availabilityId`.
 *       Requires a valid `token` cookie. No request body.
 *       There is no `POST /api/bookings` endpoint; bookings are created through Payments.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: User bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Fetched all bookings
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       bookingReference:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       venueId:
 *                         type: object
 *                         description: Populated venue document
 *                       availabilityId:
 *                         type: object
 *                         description: Populated availability slot document
 *                       amount:
 *                         type: number
 *                       bookingStatus:
 *                         type: string
 *                         enum: [confirmed, cancelled]
 *                       paymentMethod:
 *                         type: string
 *                         nullable: true
 *                       razorpayOrderId:
 *                         type: string
 *                         nullable: true
 *                       paymentId:
 *                         type: string
 *                         nullable: true
 *                       paymentStatus:
 *                         type: string
 *                         enum: [pending, paid, failed, refunded]
 *                       contactPhone:
 *                         type: string
 *                       bookedAt:
 *                         type: string
 *                         format: date-time
 *                       cancelledAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       "401":
 *         description: Missing, invalid, or expired token cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access. Please login.
 *       "403":
 *         description: Account deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Your account has been deactivated. Please contact support.
 *       "500":
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Something went wrong. Please try again later.
 */

/**
 * @openapi
 * /api/bookings/provider-bookings:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: List provider venue bookings
 *     description: >
 *       Returns all bookings for venues owned by the authenticated provider,
 *       sorted by newest first. Populates `userId` (name, email, phone),
 *       `venueId`, and `availabilityId`.
 *       Requires a valid `token` cookie and the `provider` role. No request body.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: Provider bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       bookingReference:
 *                         type: string
 *                       userId:
 *                         type: object
 *                         description: Populated user subset (name, email, phone)
 *                         properties:
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           phone:
 *                             type: string
 *                       venueId:
 *                         type: object
 *                         description: Populated venue document
 *                       availabilityId:
 *                         type: object
 *                         description: Populated availability slot document
 *                       amount:
 *                         type: number
 *                       bookingStatus:
 *                         type: string
 *                         enum: [confirmed, cancelled]
 *                       paymentMethod:
 *                         type: string
 *                         nullable: true
 *                       razorpayOrderId:
 *                         type: string
 *                         nullable: true
 *                       paymentId:
 *                         type: string
 *                         nullable: true
 *                       paymentStatus:
 *                         type: string
 *                         enum: [pending, paid, failed, refunded]
 *                       contactPhone:
 *                         type: string
 *                       bookedAt:
 *                         type: string
 *                         format: date-time
 *                       cancelledAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       "401":
 *         description: Missing, invalid, or expired token cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access. Please login.
 *       "403":
 *         description: Account deactivated, or authenticated user is not a provider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Access denied. You do not have the permission to perform this action.
 *       "500":
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Something went wrong. Please try again later.
 */
