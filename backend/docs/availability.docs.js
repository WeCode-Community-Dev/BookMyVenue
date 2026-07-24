/**
 * Availability API documentation (OpenAPI).
 * Keep route/controller files free of Swagger comments.
 */

/**
 * @openapi
 * /api/availability/create:
 *   post:
 *     tags:
 *       - Availability
 *     summary: Create availability slot
 *     description: >
 *       Creates an availability slot for a venue owned by the authenticated provider.
 *       Requires a valid `token` cookie and the `provider` role.
 *       Times use 12-hour format such as `09:00 AM`.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venueId
 *               - date
 *               - slotLabel
 *               - startTime
 *               - endTime
 *             properties:
 *               venueId:
 *                 type: string
 *                 description: MongoDB ObjectId of the venue
 *               date:
 *                 type: string
 *                 format: date
 *               slotLabel:
 *                 type: string
 *                 enum: [morning, evening, night, fullday]
 *               startTime:
 *                 type: string
 *                 example: "09:00 AM"
 *               endTime:
 *                 type: string
 *                 example: "12:00 PM"
 *     responses:
 *       "201":
 *         description: Availability created successfully
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
 *                   example: Availability created successfully
 *                 data:
 *                   type: object
 *                   description: Created availability slot document
 *       "400":
 *         description: >
 *           Missing fields, invalid venue ID/date/time, past date,
 *           end time not after start time, or slot already exists
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
 *                   example: Please fill all required fields
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
 *         description: Not a provider, or not the venue owner
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
 *                   example: You can only manage your own venue
 *       "404":
 *         description: Venue not found
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
 *                   example: Venue not found
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
 * /api/availability/{venueId}:
 *   get:
 *     tags:
 *       - Availability
 *     summary: List venue availability
 *     description: >
 *       Returns all availability slots for a venue, sorted by date and start time.
 *       Response may be served from Redis cache when available.
 *       This endpoint is public and does not require authentication.
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the venue
 *     responses:
 *       "200":
 *         description: Availability slots retrieved successfully
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
 *                       venueId:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       slotLabel:
 *                         type: string
 *                         enum: [morning, evening, night, fullday]
 *                       startTime:
 *                         type: string
 *                       endTime:
 *                         type: string
 *                       isBooked:
 *                         type: boolean
 *                       bookingId:
 *                         type: string
 *                         nullable: true
 *                       isActive:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       "400":
 *         description: Invalid venue ID
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
 *                   example: Invalid venue ID
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
 * /api/availability/deactivate/{slotId}:
 *   patch:
 *     tags:
 *       - Availability
 *     summary: Deactivate availability slot
 *     description: >
 *       Sets `isActive` to false for a slot on a venue owned by the authenticated provider.
 *       Booked slots cannot be deactivated. Requires a valid `token` cookie and the `provider` role.
 *       No request body.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the availability slot
 *     responses:
 *       "200":
 *         description: Slot deactivated successfully
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
 *                   example: Slot deactivated successfully
 *                 data:
 *                   type: object
 *                   description: Updated availability slot document
 *       "400":
 *         description: Invalid slot ID, or slot is booked
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
 *                   example: Booked slots cannot be deactivated
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
 *         description: Not a provider, or not the venue owner
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
 *                   example: Unauthorized
 *       "404":
 *         description: Slot or venue not found
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
 *                   example: Slot not found
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
 * /api/availability/activate/{slotId}:
 *   patch:
 *     tags:
 *       - Availability
 *     summary: Activate availability slot
 *     description: >
 *       Sets `isActive` to true for a slot on a venue owned by the authenticated provider.
 *       Requires a valid `token` cookie and the `provider` role. No request body.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the availability slot
 *     responses:
 *       "200":
 *         description: Slot activated successfully
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
 *                   example: Slot activated successfully
 *                 data:
 *                   type: object
 *                   description: Updated availability slot document
 *       "400":
 *         description: Invalid slot ID
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
 *                   example: Invalid slot ID
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
 *         description: Not a provider, or not the venue owner
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
 *                   example: Unauthorized
 *       "404":
 *         description: Slot or venue not found
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
 *                   example: Slot not found
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
