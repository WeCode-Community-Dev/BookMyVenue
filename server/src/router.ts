import { Router } from 'express';
import { ResponseUtil } from './utils/responseUtils';
import { authRouter } from './modules/auth/auth.router';
import { userRouter } from './modules/user/user.router';
import { venueRouter } from './modules/venue/venue.router';
import { bookingRouter } from './modules/booking/booking.router';
import { rbacRouter } from './modules/rbac/rbac.router';
import { availabilityRouter } from './modules/availability/availability.router';
import { roleRouter } from './modules/role/role.router';
import { swaggerRouter } from './modules/swagger/swagger.router';
import ownerRouter from './modules/owner/owner.router';
import { geoRouter } from './modules/geo/geo.router';
import { wishlistRouter } from './modules/wishlist/wishlist.router';
import { reviewRouter } from './modules/review/review.router';
import { moderationRouter } from './modules/moderation/moderation.router';

const router: Router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Server health check
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (_req, res) => {
  ResponseUtil.success(res, 'Service is healthy');
});

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/venues', venueRouter);
router.use('/bookings', bookingRouter);
router.use('/availability', availabilityRouter);
router.use('/rbac', rbacRouter);
router.use('/role', roleRouter);
router.use('/swagger', swaggerRouter);
router.use('/owner', ownerRouter);
router.use('/geo', geoRouter);
router.use('/wishlist', wishlistRouter);
router.use('/reviews', reviewRouter);
router.use('/moderation', moderationRouter);

export default router;
