import express from 'express';
import { getVenues, getVenueById, createVenue, getMyVenues, updateVenue, deleteVenue } from '../controllers/venueController.js';
import { getVenueBookings, getVenueAvailability } from '../controllers/bookingController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public list route
router.get('/', getVenues); // Get all approved venues (filtered/sorted)

// Protected Host-Only (Venue Owner) Routes (MUST be declared before parameterized /:id routes)
router.get('/my-venues', authenticateToken, requireRole('venue_owner'), getMyVenues); // Get host's listed venues
router.post('/', authenticateToken, requireRole('venue_owner'), createVenue); // List new venue (pending approval)
router.put('/:id', authenticateToken, requireRole('venue_owner'), updateVenue); // Edit own venue details
router.delete('/:id', authenticateToken, requireRole('venue_owner'), deleteVenue); // Remove own venue listing

// Public Parameterized Routes
router.get('/:id', getVenueById); // Get detailed view of single venue by ID
router.get('/:id/bookings', getVenueBookings); // Get booking ranges for calendar highlighting
router.get('/:id/availability', getVenueAvailability); // Fetch available hours slots or daily ranges

export default router;

