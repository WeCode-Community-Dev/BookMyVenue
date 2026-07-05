import express from 'express';
import { 
  getDashboardStats, 
  getAllVenues, 
  updateVenueStatus, 
  getAllBookings, 
  getAllUsers 
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply admin token validation and role verification globally to all endpoints below
router.use(authenticateToken);
router.use(requireRole('admin'));

// Admin Dashboard Endpoints
router.get('/stats', getDashboardStats); // Fetch overall metrics and revenue splits
router.get('/venues', getAllVenues); // Get all listed venues (approved/pending/declined)
router.put('/venues/:id/status', updateVenueStatus); // Update status (approve/decline venue listing)
router.get('/bookings', getAllBookings); // View all customer bookings on the platform
router.get('/users', getAllUsers); // List all users and venue owners on the platform

export default router;
