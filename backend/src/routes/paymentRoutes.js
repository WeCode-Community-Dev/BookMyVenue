import express from 'express';
import userAuthMiddleware from '../middleware/userAuthMiddleware.js';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';



const router = express.Router()

router.post("/create-order", userAuthMiddleware, createOrder);
router.post("/verify-payment", userAuthMiddleware, verifyPayment);

export default router;