import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
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

router.post('/quote', getBookingQuote);
router.post('/', createBooking);
router.post('/verify-payment', verifyPayment);
router.post('/pay-balance', payBalance);
router.post('/verify-balance', verifyBalancePayment);
router.post('/pay-wallet', payWithWallet);

router.get('/:bookingId/cancellation-quote', getCancellationQuote);
router.patch('/:bookingId/cancel', cancelBooking);

// Delete an unpaid (PENDING) booking — called on payment failure, dismiss, or explicit cancel
router.delete('/:bookingId', deleteBooking);

// Fetch a single booking by id — must be after named DELETE routes
router.get('/:bookingId', getBookingById);

export default router;
