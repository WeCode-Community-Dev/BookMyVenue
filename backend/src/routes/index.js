import { Router } from 'express';
import authRouter from './authRouter.js';
import venueRouter from './venueRouter.js';
import favoriteRouter from './favouritesRouter.js';
import bookingRouter from './bookingsRouter.js';

const router = Router();

console.log('Routes file loaded');

router.use('/auth', authRouter);
router.use(venueRouter);
router.use(favoriteRouter);
router.use(bookingRouter);

export default router;
