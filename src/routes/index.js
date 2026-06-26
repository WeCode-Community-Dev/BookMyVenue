import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', service: 'book-my-venue-api' },
  });
});

export default router;
