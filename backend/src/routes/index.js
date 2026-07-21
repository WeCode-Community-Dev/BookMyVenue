import { Router } from 'express';
import authRouter from './authRouter.js';
import venueRouter from './venueRouter.js';
import favoriteRouter from './favouritesRouter.js';
import bookingRouter from './bookingsRouter.js';
import adminRouter from './adminRouter.js';
import notificationRouter from './notificationRouter.js'
import conversationRouter from './conversationRouter.js';

const router = Router();

console.log('Routes file loaded');

router.use('/auth', authRouter);
router.use(venueRouter);
router.use(favoriteRouter);
router.use(bookingRouter);
router.use('/admin',adminRouter);
router.use(notificationRouter);
router.use(conversationRouter);

export default router;
