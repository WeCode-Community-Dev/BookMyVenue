import express from 'express';
import { getBookings, createBooking, cancelBooking, lockVenue, getBookingById } from '../controllers/bookingController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply global authentication block middleware for bookings
router.use(authenticateToken); 

router.get('/', getBookings); // Get user's active bookings list
router.get('/:id', getBookingById); // Get detailed invoice/receipt fields by booking ID
router.post('/', createBooking); // Submit new booking reservation
router.post('/lock', requireRole('venue_owner'), lockVenue); // Block dates off for maintenance/offline events
router.put('/:id/cancel', cancelBooking); // Trigger cancel action and calculate refund

export default router;
