import { Router } from 'express';
import { catchErrors } from '../handlers/error_handlers.js';
import { isAuthenticated } from '../middlewares/authentication.js';
import { requireRole } from '../middlewares/authentication.js';
import bookingController from '../controllers/bookingController.js';

const router = Router();

router.get(
  '/venue/:id/availability',
  isAuthenticated,
  requireRole('user'),
  catchErrors(bookingController.checkAvailability)
);
router.post(
  '/bookings',
  isAuthenticated,
  requireRole('user'),
  catchErrors(bookingController.bookVenue)
);

router.get(
  '/payments/verify/:bookingId',
  isAuthenticated,
  requireRole('user'),
  catchErrors(bookingController.verifyPayment)
);

router.get(
    '/bookings/:userId',
    isAuthenticated,
    requireRole('user'),
    catchErrors(bookingController.getUserBookings)
);

router.get(
    '/bookings/owner/:ownerId',
    isAuthenticated,
    requireRole('owner'),
    catchErrors(bookingController.getOwnerBookings)
);


export default router;
