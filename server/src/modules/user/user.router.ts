import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as controller from './user.controller';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
import { paginationMiddleware } from '../../middlewares/pagination.middleware';
import * as validator from './user.validator';

const router: Router = Router();

const uploadSignatureLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: 'Too many upload requests, please try again later',
});

/**
 * @openapi
 * /user/profile:
 *   get:
 *     tags: [User]
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
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
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *       401:
 *         description: Not authenticated
 */
router.route('/profile').get(verifyAccessToken, controller.getProfile);

/**
 * @openapi
 * /user/profile:
 *   patch:
 *     tags: [User]
 *     summary: Update the authenticated user's own profile (username and/or profile picture)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *               profilePicturePublicId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       409:
 *         description: Username already taken
 */
router
  .route('/profile')
  .patch(verifyAccessToken, validateBody(validator.updateProfileSchema), controller.updateProfile);

/**
 * @openapi
 * /user/profile/upload-signature:
 *   get:
 *     tags: [User]
 *     summary: Get a Cloudinary upload signature for a profile picture upload
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cloudinary signature and upload parameters
 *       401:
 *         description: Not authenticated
 *       429:
 *         description: Too many upload signature requests
 */
router
  .route('/profile/upload-signature')
  .get(verifyAccessToken, uploadSignatureLimiter, controller.getAvatarUploadSignature);

/**
 * @openapi
 * /user/profile/picture:
 *   delete:
 *     tags: [User]
 *     summary: Remove the authenticated user's profile picture
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile picture removed successfully
 *       400:
 *         description: No profile picture to remove
 *       401:
 *         description: Not authenticated
 */
router.route('/profile/picture').delete(verifyAccessToken, controller.deleteProfilePicture);

/**
 * @openapi
 * /user/all:
 *   get:
 *     tags: [User]
 *     summary: Get all users (Admin/SuperAdmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter users by role name
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 */
router
  .route('/all')
  .get(verifyAccessToken, requireRole('admin'), paginationMiddleware(), controller.getAllUsers);

/**
 * @openapi
 * /user/{userId}/toggle-status:
 *   patch:
 *     tags: [User]
 *     summary: Toggle user active status (SuperAdmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: SuperAdmin role required
 */
router
  .route('/:userId/toggle-status')
  .patch(verifyAccessToken, requireRole('superAdmin'), controller.toggleUserStatus);

/**
 * @openapi
 * /user/{userId}/reset-password:
 *   post:
 *     tags: [User]
 *     summary: Reset user password and email (SuperAdmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User password reset successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: SuperAdmin role required
 */
router
  .route('/:userId/reset-password')
  .post(verifyAccessToken, requireRole('superAdmin'), controller.resetUserPassword);

/**
 * @openapi
 * /user/{userId}/ban:
 *   post:
 *     tags: [User]
 *     summary: Ban a user (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: User banned successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 */
router.route('/:userId/ban').post(verifyAccessToken, requireRole('admin'), controller.banUser);

/**
 * @openapi
 * /user/{userId}/unban:
 *   post:
 *     tags: [User]
 *     summary: Unban a user (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unbanned successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 */
router.route('/:userId/unban').post(verifyAccessToken, requireRole('admin'), controller.unbanUser);

export { router as userRouter };
