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

router.patch(
  '/venues/:id',
  isAuthenticated,
  requireRole('owner','admin'),
  catchErrors(venueController.updateVenue)
)

router.get(
  '/owner/venues',
  isAuthenticated,
  requireRole('owner'),
  catchErrors(venueController.getOwnerVenues)
);

//users routes
router.get('/venues', isAuthenticated, requireRole('user', 'admin'), catchErrors(venueController.getVenues));
router.get('/venue/:id', catchErrors(venueController.getVenueDetails));

router.patch(
  '/owner/venue/:id/submit',
  isAuthenticated,
  requireRole('owner'),
  catchErrors(venueController.checkSubmission)
);

router.get(
  '/amenities',
  isAuthenticated,
  catchErrors(venueController.getAmenities)
)

export default router;
