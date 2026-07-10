import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import ownerRoutes from './owner.routes';
import venueRoutes from './venue.routes';
import bookingRoutes from './booking.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/owners', ownerRoutes);
router.use('/venues', venueRoutes);

router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);

export default router;
