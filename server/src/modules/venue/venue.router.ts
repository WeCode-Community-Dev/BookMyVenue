import { Router } from 'express';
import { verifyAccessToken, verifyAccessTokenOptional } from '../../middlewares/auth.middleware';
import { requirePermission, requireRole } from '../../middlewares/rbac.middleware';
import { PERMISSIONS as P } from '../../constants/permissions';
import * as controller from './venue.controller';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../../middlewares/validation.middleware';
import * as validator from './venue.validator';
import rateLimit from 'express-rate-limit';
import { paginationMiddleware } from '../../middlewares/pagination.middleware';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware';

const router: Router = Router();

const uploadSignatureLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 20,
  message: 'Too many upload requests, please try again later',
});

/**
 * @openapi
 * /venues/upload-signature:
 *   get:
 *     tags: [Venues]
 *     summary: Get a Cloudinary upload signature for direct browser uploads
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cloudinary signature and upload parameters
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
 *                         signature:
 *                           type: string
 *                         timestamp:
 *                           type: integer
 *                         cloudName:
 *                           type: string
 *                         apiKey:
 *                           type: string
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       429:
 *         description: Too many upload signature requests
 */
router
  .route('/upload-signature')
  .get(verifyAccessToken, uploadSignatureLimiter, controller.getUploadSignature);

/**
 * @openapi
 * /venues:
 *   post:
 *     tags: [Venues]
 *     summary: Create a new venue
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Venue creation payload — validated by createVenueSchema
 *     responses:
 *       201:
 *         description: Venue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *   get:
 *     tags: [Venues]
 *     summary: List active venues (public, paginated, filterable)
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
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search venues by name or description
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: venueType
 *         schema:
 *           type: string
 *         description: Filter by venue type
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Filter by Kerala district
 *       - in: query
 *         name: capacity
 *         schema:
 *           type: integer
 *         description: Minimum capacity required
 *       - in: query
 *         name: spaceAttributes
 *         schema:
 *           type: string
 *         description: Comma-separated or single space attribute
 *       - in: query
 *         name: seatingConfigurations
 *         schema:
 *           type: string
 *         description: Comma-separated or single seating configuration
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: string
 *         description: Comma-separated or single amenity
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude for geo-search (must be paired with lng)
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Longitude for geo-search (must be paired with lat)
 *       - in: query
 *         name: radiusKm
 *         schema:
 *           type: number
 *           default: 25
 *         description: Search radius in km for geo queries
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price-low, price-high, rating, distance]
 *     responses:
 *       200:
 *         description: Paginated list of active venues
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     meta:
 *                       $ref: '#/components/schemas/PaginatedMeta'
 */
router
  .route('/')
  .post(verifyAccessToken, validateBody(validator.createVenueSchema), controller.createVenue)
  .get(
    verifyAccessTokenOptional,
    validateQuery(validator.publicVenueFiltersSchema),
    paginationMiddleware(),
    controller.getPaginatedActiveVenues
  );

/**
 * @openapi
 * /venues/my-venues:
 *   get:
 *     tags: [Venues]
 *     summary: List the authenticated owner's venues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of venues owned by the current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router
  .route('/my-venues')
  .get(verifyAccessToken, requirePermission(P.venues.read), controller.getMyVenues);

/**
 * @openapi
 * /venues/pins:
 *   get:
 *     tags: [Venues]
 *     summary: Get lightweight venue pins for map view (geospatial filtering)
 *     parameters:
 *       - in: query
 *         name: swLng
 *         schema:
 *           type: number
 *         description: Southwest longitude (bounding box)
 *       - in: query
 *         name: swLat
 *         schema:
 *           type: number
 *         description: Southwest latitude
 *       - in: query
 *         name: neLng
 *         schema:
 *           type: number
 *         description: Northeast longitude
 *       - in: query
 *         name: neLat
 *         schema:
 *           type: number
 *         description: Northeast latitude
 *     responses:
 *       200:
 *         description: Array of venue pins with location and rating
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.route('/pins').get(controller.getVenuePins);

/**
 * @openapi
 * /venues/draft:
 *   put:
 *     tags: [Venues]
 *     summary: Create or update the owner's draft venue
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial venue payload for draft persistence
 *     responses:
 *       200:
 *         description: Draft saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authenticated
 *   get:
 *     tags: [Venues]
 *     summary: Get the owner's current draft venue
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Draft venue object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: No draft found
 */
router
  .route('/draft')
  .put(verifyAccessToken, controller.upsertDraft)
  .get(verifyAccessToken, requirePermission(P.venues.read), controller.getMyDraft);

/**
 * @openapi
 * /venues/pending:
 *   get:
 *     tags: [Venues]
 *     summary: List venues pending admin approval (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of pending venues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 */
router
  .route('/pending')
  .get(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.activate),
    controller.getPendingVenues
  );

/**
 * @openapi
 * /venues/reviews:
 *   get:
 *     tags: [Venues]
 *     summary: List all venues with pending reviews grouped by intent (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of venues with pending reviews
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 */
router
  .route('/reviews')
  .get(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.activate),
    controller.getReviewsList
  );

/**
 * @openapi
 * /venues/all:
 *   get:
 *     tags: [Venues]
 *     summary: List all venues across all statuses (admin only, paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, pending, active, rejected, deactivated]
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
 *     responses:
 *       200:
 *         description: Paginated list of all venues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
    requirePermission(P.venues.activate),
    validateQuery(validator.adminVenueFiltersSchema),
    paginationMiddleware(),
    controller.getAllVenues
  );

/**
 * @openapi
 * /venues/featured:
 *   get:
 *     tags: [Venues]
 *     summary: Get all featured venues (public)
 *     responses:
 *       200:
 *         description: Array of featured venues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.route('/featured').get(verifyAccessTokenOptional, controller.getFeaturedVenues);

/**
 * @openapi
 * /venues/{id}:
 *   get:
 *     tags: [Venues]
 *     summary: Get a venue by ID (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64b1f2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       200:
 *         description: Venue details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid venue ID format
 *       404:
 *         description: Venue not found
 *   put:
 *     tags: [Venues]
 *     summary: Update a venue (owner)
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
 *             description: Fields to update — validated by updateVenueSchema
 *     responses:
 *       200:
 *         description: Venue updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Venue not found
 *   delete:
 *     tags: [Venues]
 *     summary: Delete a venue (owner)
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
 *         description: Venue deleted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Venue not found
 */
router
  .route('/:id')
  .get(
    verifyAccessTokenOptional,
    validateParams(validator.venueIdParamSchema),
    controller.getVenueById
  )
  .put(
    verifyAccessToken,
    idempotencyMiddleware(),
    requirePermission(P.venues.update),
    validateParams(validator.venueIdParamSchema),
    validateBody(validator.updateVenueSchema),
    controller.updateVenue
  )
  .delete(
    verifyAccessToken,
    requirePermission(P.venues.delete),
    validateParams(validator.venueIdParamSchema),
    controller.deleteVenue
  );

/**
 * @openapi
 * /venues/{id}/submit:
 *   post:
 *     tags: [Venues]
 *     summary: Submit a venue for admin review
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
 *         description: Venue submitted for review
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Venue not found
 */
router
  .route('/:id/submit')
  .post(
    verifyAccessToken,
    requirePermission(P.venues.update),
    validateParams(validator.venueIdParamSchema),
    controller.submitVenue
  );

/**
 * @openapi
 * /venues/{id}/approve:
 *   post:
 *     tags: [Venues]
 *     summary: Approve a venue (admin only)
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
 *         description: Venue approved and set to active
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Venue not found
 */
router
  .route('/:id/approve')
  .post(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.activate),
    validateParams(validator.venueIdParamSchema),
    controller.approveVenue
  );

/**
 * @openapi
 * /venues/{id}/reject:
 *   post:
 *     tags: [Venues]
 *     summary: Reject a venue with a reason (admin only)
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
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Images do not meet quality standards
 *     responses:
 *       200:
 *         description: Venue rejected
 *       400:
 *         description: Rejection reason required
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Venue not found
 */
router
  .route('/:id/reject')
  .post(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.deactivate),
    validateParams(validator.venueIdParamSchema),
    validateBody(validator.rejectVenueSchema),
    controller.rejectVenue
  );

/**
 * @openapi
 * /venues/{id}/unsuspend:
 *   post:
 *     tags: [Venues]
 *     summary: Activate a venue (admin only)
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
 *         description: Venue activated
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Venue not found
 */
router
  .route('/:id/unsuspend')
  .post(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.activate),
    validateParams(validator.venueIdParamSchema),
    controller.unsuspendVenue
  );

/**
 * @openapi
 * /venues/{id}/deactivate:
 *   post:
 *     tags: [Venues]
 *     summary: Deactivate a venue (admin only)
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
 *         description: Venue deactivated
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Venue not found
 */
router
  .route('/:id/deactivate')
  .post(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.deactivate),
    validateParams(validator.venueIdParamSchema),
    validateBody(validator.suspendVenueSchema),
    controller.suspendVenue
  );

/**
 * @openapi
 * /venues/{id}/feature:
 *   post:
 *     tags: [Venues]
 *     summary: Feature a venue (admin only)
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
 *             required: [duration]
 *             properties:
 *               duration:
 *                 type: integer
 *                 nullable: true
 *                 description: Duration in days to feature, or null for indefinite
 *     responses:
 *       200:
 *         description: Venue featured status updated
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Venue not found
 *       409:
 *         description: Only approved venues can be featured
 *   delete:
 *     tags: [Venues]
 *     summary: Unfeature a venue (admin only)
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
 *         description: Venue removed from featured list
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Venue not found
 */
router
  .route('/:id/feature')
  .post(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.activate),
    validateParams(validator.venueIdParamSchema),
    validateBody(validator.featureVenueSchema),
    controller.featureVenue
  )
  .delete(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.activate),
    validateParams(validator.venueIdParamSchema),
    controller.unfeatureVenue
  );

/**
 * @openapi
 * /venues/{id}/extend-deadline:
 *   post:
 *     tags: [Venues]
 *     summary: Extend edit deadline for a rejected venue (superAdmin only)
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
 *             required: [newDeadline]
 *             properties:
 *               newDeadline:
 *                 type: string
 *                 format: date-time
 *                 description: New deadline for editing (must be within 120 days)
 *     responses:
 *       200:
 *         description: Edit deadline extended successfully
 *       400:
 *         description: Invalid deadline
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: SuperAdmin role required
 *       404:
 *         description: Venue not found
 */
router
  .route('/:id/extend-deadline')
  .post(
    verifyAccessToken,
    requireRole('superAdmin'),
    validateParams(validator.venueIdParamSchema),
    validateBody(validator.extendVenueDeadlineSchema),
    controller.extendDeadline
  );

/**
 * @openapi
 * /venues/{id}/approve-review:
 *   post:
 *     tags: [Venues]
 *     summary: Approve a pending review (admin only)
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
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review approved
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Venue not found
 *       409:
 *         description: No pending review
 */
router
  .route('/:id/approve-review')
  .post(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.activate),
    validateParams(validator.venueIdParamSchema),
    validateBody(validator.approveReviewSchema),
    idempotencyMiddleware(),
    controller.approveReview
  );

/**
 * @openapi
 * /venues/{id}/reject-review:
 *   post:
 *     tags: [Venues]
 *     summary: Reject a pending review (admin only)
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
 *             required: [note]
 *             properties:
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review rejected
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Venue not found
 *       409:
 *         description: No pending review
 */
router
  .route('/:id/reject-review')
  .post(
    verifyAccessToken,
    requireRole('admin'),
    requirePermission(P.venues.deactivate),
    validateParams(validator.venueIdParamSchema),
    validateBody(validator.rejectReviewSchema),
    idempotencyMiddleware(),
    controller.rejectReview
  );

export { router as venueRouter };
