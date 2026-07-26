import { Router } from 'express';
import * as controller from './auth.controller';
import * as authValidator from './auth.validator';
import { validateBody, validateParams } from '../../middlewares/validation.middleware';
import { verifyAccessToken, verifyRefreshToken } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router: Router = Router();

const secondaryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests from this IP. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: SecurePass@1
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Username or email already taken
 */
router.route('/register').post(validateBody(authValidator.registerSchema), controller.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email/username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass@1
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error or missing credentials
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many requests
 */
router
  .route('/login')
  .post(loginRateLimiter, validateBody(authValidator.loginSchema), controller.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using refresh token cookie
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: New access token issued
 *       401:
 *         description: Missing, invalid, or expired refresh token
 */
router.route('/refresh').post(verifyRefreshToken, controller.refreshToken);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and revoke the current session
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Not authenticated
 */
router.route('/logout').post(verifyAccessToken, verifyRefreshToken, controller.logout);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Send a password reset email
 *     description: Rate-limited to 5 requests per 15 minutes per IP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Reset email sent if account exists
 *       400:
 *         description: Invalid email format
 *       429:
 *         description: Too many requests
 */
router
  .route('/forgot-password')
  .post(
    secondaryRateLimiter,
    validateBody(authValidator.forgotPasswordSchema),
    controller.forgotPassword
  );

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using a valid reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token received in the reset email
 *                 example: abc123xyz
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: NewSecurePass@1
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token, or validation error
 */
router
  .route('/reset-password')
  .post(validateBody(authValidator.resetPasswordSchema), controller.resetPassword);

/**
 * @openapi
 * /auth/change-password:
 *   patch:
 *     tags: [Auth]
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or incorrect old password
 *       401:
 *         description: Unauthorized
 */
router.route('/change-password').patch(verifyAccessToken, controller.changePassword);

/**
 * @openapi
 * /auth/sessions:
 *   get:
 *     tags: [Auth]
 *     summary: List the authenticated user's active sessions/devices
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Array of active sessions, each flagged with isCurrent
 *       401:
 *         description: Not authenticated
 */
router.route('/sessions').get(verifyAccessToken, verifyRefreshToken, controller.listSessions);

/**
 * @openapi
 * /auth/sessions/logout-others:
 *   post:
 *     tags: [Auth]
 *     summary: Sign out every other active session/device
 *     description: |
 *       Blocked with a 403 if the current session is less than 48 hours old and
 *       any other active session predates it — prevents a newly-added device
 *       from locking out established devices.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Other sessions signed out successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Current device is too new to sign out older devices
 */
router
  .route('/sessions/logout-others')
  .post(verifyAccessToken, verifyRefreshToken, controller.revokeAllOtherSessions);

/**
 * @openapi
 * /auth/sessions/{sessionId}:
 *   delete:
 *     tags: [Auth]
 *     summary: Sign out one specific session/device
 *     description: |
 *       Blocked with a 403 if the current session is less than 48 hours old and
 *       the target session predates it.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Device signed out successfully
 *       400:
 *         description: Cannot revoke the current session this way
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Current device is too new to sign out older devices
 *       404:
 *         description: Session not found
 */
router
  .route('/sessions/:sessionId')
  .delete(
    verifyAccessToken,
    verifyRefreshToken,
    validateParams(authValidator.sessionIdParamSchema),
    controller.revokeSession
  );

export { router as authRouter };
