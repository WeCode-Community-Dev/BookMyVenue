import { Router } from 'express';
import authRouter from './authRouter.js';
import venueRouter from './venueRouter.js';
import favoriteRouter from './favouritesRouter.js'

const router = Router();

console.log('Routes file loaded');

router.use('/auth', authRouter);
router.use(venueRouter);
router.use(favoriteRouter)

export default router;
