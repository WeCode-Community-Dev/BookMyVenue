/**
 * Venues API documentation (OpenAPI).
 * Keep route/controller files free of Swagger comments.
 */

/**
 * @openapi
 * /api/venues:
 *   get:
 *     tags:
 *       - Venues
 *     summary: List active venues
 *     description: >
 *       Returns all active venues, sorted by newest first.
 *       Response may be served from Redis cache when available.
 *       This endpoint is public and does not require authentication.
 *       The controller does not accept query parameters.
 *     responses:
 *       "200":
 *         description: Active venues retrieved successfully
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
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       ownerId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                         enum:
 *                           - wedding
 *                           - corporate
 *                           - birthday
 *                           - party
 *                           - function
 *                           - photoshoot
 *                           - other
 *                       images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                             public_id:
 *                               type: string
 *                       coverImage:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                           public_id:
 *                             type: string
 *                       venueType:
 *                         type: string
 *                         enum: [offline, online, hybrid]
 *                       indoorOutdoor:
 *                         type: string
 *                         enum: [indoor, outdoor, both]
 *                       price:
 *                         type: number
 *                       pricingUnit:
 *                         type: string
 *                         enum: [perhour, perday]
 *                       capacity:
 *                         type: number
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                       rules:
 *                         type: array
 *                         items:
 *                           type: string
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       pincode:
 *                         type: string
 *                       location:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                             nullable: true
 *                           longitude:
 *                             type: number
 *                             nullable: true
 *                       averageRating:
 *                         type: number
 *                       totalReviews:
 *                         type: number
 *                       isActive:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
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
 * /api/venues/{venueId}:
 *   get:
 *     tags:
 *       - Venues
 *     summary: Get venue by ID
 *     description: >
 *       Returns a single active venue by ID.
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
 *         description: Venue retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     ownerId:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                       enum:
 *                         - wedding
 *                         - corporate
 *                         - birthday
 *                         - party
 *                         - function
 *                         - photoshoot
 *                         - other
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                           public_id:
 *                             type: string
 *                     coverImage:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                         public_id:
 *                           type: string
 *                     venueType:
 *                       type: string
 *                       enum: [offline, online, hybrid]
 *                     indoorOutdoor:
 *                       type: string
 *                       enum: [indoor, outdoor, both]
 *                     price:
 *                       type: number
 *                     pricingUnit:
 *                       type: string
 *                       enum: [perhour, perday]
 *                     capacity:
 *                       type: number
 *                     amenities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     rules:
 *                       type: array
 *                       items:
 *                         type: string
 *                     address:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     pincode:
 *                       type: string
 *                     location:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                           nullable: true
 *                         longitude:
 *                           type: number
 *                           nullable: true
 *                     averageRating:
 *                       type: number
 *                     totalReviews:
 *                       type: number
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
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
 *       "404":
 *         description: Venue not found or not active
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
 * /api/venues/create:
 *   post:
 *     tags:
 *       - Venues
 *     summary: Create venue
 *     description: >
 *       Creates a new venue for the authenticated provider.
 *       Requires a valid `token` cookie and the `provider` role.
 *       Accepts multipart/form-data with venue fields and up to 5 image files
 *       under the field name `images`. At least one image is required.
 *       `amenities` and `rules` must be JSON array strings when provided.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - price
 *               - capacity
 *               - address
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: Venue category (validated/normalized by the controller)
 *               venueType:
 *                 type: string
 *               indoorOutdoor:
 *                 type: string
 *               price:
 *                 type: number
 *               pricingUnit:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               amenities:
 *                 type: string
 *                 description: JSON string of a string array, e.g. '["wifi","parking"]'
 *               rules:
 *                 type: string
 *                 description: JSON string of a string array
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: One to five image files (multer field name `images`, max 5)
 *     responses:
 *       "201":
 *         description: Venue created successfully
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
 *                   example: Venue created successfully.
 *                 data:
 *                   type: object
 *                   description: Created venue document
 *       "400":
 *         description: >
 *           Missing required fields, invalid price/capacity/coordinates/category,
 *           invalid amenities/rules JSON, or no images uploaded
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
 *                   example: Please fill all required fields.
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
 *         description: Authenticated user is not a provider
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
 *         description: Failed to create venue
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
 *                   example: Failed to create venue. Please try again.
 */

/**
 * @openapi
 * /api/venues/update/{id}:
 *   put:
 *     tags:
 *       - Venues
 *     summary: Update venue
 *     description: >
 *       Updates an existing venue owned by the authenticated provider.
 *       Requires a valid `token` cookie and the `provider` role.
 *       Accepts multipart/form-data. All form fields are optional; only provided
 *       fields are updated. Optional new images use multer field name `images`
 *       (up to 5). If new images are uploaded, they replace existing venue images.
 *       `amenities` and `rules` must be JSON array strings when provided.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the venue to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               venueType:
 *                 type: string
 *               indoorOutdoor:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: integer
 *               amenities:
 *                 type: string
 *                 description: JSON string of a string array
 *               rules:
 *                 type: string
 *                 description: JSON string of a string array
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Optional replacement images (multer field name `images`, max 5)
 *     responses:
 *       "200":
 *         description: Venue updated successfully
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
 *                   example: Venue updated successfully
 *                 data:
 *                   type: object
 *                   description: Updated venue document
 *       "400":
 *         description: >
 *           Invalid venue ID, category, price, capacity, coordinates,
 *           or amenities/rules JSON
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
 *                   example: Access denied
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
 * /api/venues/deactivate/{id}:
 *   patch:
 *     tags:
 *       - Venues
 *     summary: Deactivate venue
 *     description: >
 *       Soft-deletes a venue by setting `isActive` to false.
 *       There is no hard-delete venue endpoint in this API.
 *       Requires a valid `token` cookie and the `provider` role.
 *       Only the venue owner can deactivate it. No request body.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the venue to deactivate
 *     responses:
 *       "200":
 *         description: Venue deactivated successfully
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
 *                   example: Venue deactivated successfully
 *                 data:
 *                   type: object
 *                   description: Updated venue document with isActive set to false
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
 *                   example: Access denied
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
 * /api/venues/my-venues:
 *   get:
 *     tags:
 *       - Venues
 *     summary: List my venues
 *     description: >
 *       Returns all venues owned by the authenticated provider, including inactive ones,
 *       sorted by newest first. Requires a valid `token` cookie and the `provider` role.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: Provider venues retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Venue document
 *                 count:
 *                   type: integer
 *                   example: 2
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
 *         description: Authenticated user is not a provider
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
 */

/**
 * @openapi
 * /api/venues/provider/{id}:
 *   get:
 *     tags:
 *       - Venues
 *     summary: Get owned venue by ID
 *     description: >
 *       Returns a single venue by ID for the authenticated provider who owns it.
 *       Unlike the public detail route, this can return inactive venues owned by the provider.
 *       Requires a valid `token` cookie and the `provider` role.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the venue
 *     responses:
 *       "200":
 *         description: Venue retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Venue document
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
 *                   example: Access denied.
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
 *                   example: Venue not found.
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
 * /api/venues/activate/{id}:
 *   patch:
 *     tags:
 *       - Venues
 *     summary: Activate venue
 *     description: >
 *       Sets `isActive` to true for a venue owned by the authenticated provider.
 *       Requires a valid `token` cookie and the `provider` role. No request body.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the venue to activate
 *     responses:
 *       "200":
 *         description: Venue activated successfully
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
 *                   example: Venue activated successfully
 *                 data:
 *                   type: object
 *                   description: Updated venue document with isActive set to true
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
 *                   example: Access denied
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
