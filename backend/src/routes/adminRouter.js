import { Router } from 'express';
import venueController from '../controllers/venueController.js';
import { catchErrors } from '../handlers/error_handlers.js';
import { isAuthenticated } from '../middlewares/authentication.js';
import { requireRole } from '../middlewares/authentication.js';
import analyticController from '../controllers/analyticController.js';

const router = Router();
console.log('Venue router loaded');

router.get(
  '/venues/pending',
  isAuthenticated,
  requireRole('admin'),
  catchErrors(venueController.getPendingVenues)
);

router.patch(
  '/venues/:id/approve',
  isAuthenticated,
  requireRole('admin'),
  catchErrors(venueController.approveVenue)
); 

router.patch(
  '/venues/:id/reject',
  isAuthenticated,
  requireRole('admin'),
  catchErrors(venueController.rejectVenue)
);

router.patch(
  '/:id/deactivate',
  isAuthenticated,
  requireRole('admin', 'owner'),
  catchErrors(venueController.deactivateVenue)
);

router.patch(
  '/:id/activate',
  isAuthenticated,
  requireRole('admin', 'owner'),
  catchErrors(venueController.activateVenue)
);

router.get(
  '/dashboard/stats',
  isAuthenticated,
  requireRole('admin'),
  catchErrors(analyticController.adminDashboardStats)
);

export default router;
