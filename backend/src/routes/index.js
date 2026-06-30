import { Router } from 'express';
import authRoutes from './authRoutes.js';
import venueRoutes from './venueRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import ownerRoutes from './ownerRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', service: 'book-my-venue-api' },
  });
});

router.use('/auth', authRoutes);
router.use('/venues', venueRoutes);
router.use('/bookings', bookingRoutes);
router.use('/owners', ownerRoutes);

export default router;
