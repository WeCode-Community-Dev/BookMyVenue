import { Router } from 'express';
import venueController from '../controllers/venueController.js';
import { catchErrors } from '../handlers/error_handlers.js';
import { isAuthenticated } from '../middlewares/authentication.js';
import { requireRole } from '../middlewares/authentication.js';

const router = Router();
console.log('Venue router loaded');

router.post(
  '/venues',
  isAuthenticated,
  requireRole('owner'),
  catchErrors(venueController.addVenue)
);
router.get(
  '/owner/venues',
  isAuthenticated,
  requireRole('owner'),
  catchErrors(venueController.getOwnerVenues)
);

//users routes
router.get('/venues',isAuthenticated, requireRole('user'), catchErrors(venueController.getVenues));
router.get('/venue/:id',catchErrors(venueController.getVenueDetails))

export default router;
