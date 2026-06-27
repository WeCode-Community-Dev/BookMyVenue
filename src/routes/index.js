import { Router } from 'express';
import authRoutes from './authRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', service: 'book-my-venue-api' },
  });
});

router.use('/auth', authRoutes);

export default router;
