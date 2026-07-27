import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validateRequest';
import {
  createBookingSchema,
  getQuoteSchema,
  verifyPaymentSchema,
  payWalletSchema,
  payBalanceSchema,
  verifyBalanceSchema,
  cancelBookingSchema,
} from '@/dto/booking.dto';
import {
  createBooking,
  getBookingAvailability,
  verifyPayment,
  deleteBooking,
  payBalance,
  verifyBalancePayment,
  getBookingQuote,
  cancelBooking,
  getBookingById,
  payWithWallet,
  getCancellationQuote,
} from '@/controllers/booking.controller';

const router = Router();

// Public — venue availability check
router.get('/venues/:venueId', getBookingAvailability);

// All routes below require authentication
router.use(authMiddleware);

router.post('/quote', validateRequest(getQuoteSchema), getBookingQuote);
router.post('/', validateRequest(createBookingSchema), createBooking);
router.post('/verify-payment', validateRequest(verifyPaymentSchema), verifyPayment);

// Payment endpoints (Top-level & Scoped REST sub-resource paths)
router.post('/pay-balance', validateRequest(payBalanceSchema), payBalance);
router.post('/:bookingId/payments/balance', validateRequest(payBalanceSchema), payBalance);

router.post('/verify-balance', validateRequest(verifyBalanceSchema), verifyBalancePayment);
router.post('/:bookingId/payments/verify-balance', validateRequest(verifyBalanceSchema), verifyBalancePayment);

router.post('/pay-wallet', validateRequest(payWalletSchema), payWithWallet);
router.post('/:bookingId/payments/wallet', validateRequest(payWalletSchema), payWithWallet);

// Cancellation endpoints
router.get('/:bookingId/cancellation-quote', getCancellationQuote);
router.patch('/:bookingId/cancel', validateRequest(cancelBookingSchema), cancelBooking);

// Delete an unpaid (PENDING) booking
router.delete('/:bookingId', deleteBooking);

// Fetch a single booking by id
router.get('/:bookingId', getBookingById);

export default router;
