import { Router } from 'express';

import { ownerDashboardController } from '@/controllers/dashboard.controller';
import * as venueController from '@/controllers/venue.controller';
import * as bookingController from '@/controllers/booking.controller';

import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles, requireOwnerVerification } from '@/middlewares/role.middleware';
import { validateInputs, validateObjectId, validateQuery } from '@/middlewares/validate.middleware';

import { upload } from '@/middlewares/upload.middleware';
import { getOwnerVenuesQuerySchema } from '@/dto/venue/get-owner-venues.dto';
import { createVenueSchema } from '@/dto/venue/create-venue.dto';
import { updateVenueSchema } from '@/dto/venue/update-venue.dto';
import { parseVenueFormData } from '@/middlewares/venue.parse.middleware';

const router = Router();

// Owner-only routes
router.use(authMiddleware, authorizeRoles('owner'));

// Dashboard
router.get('/dashboard', ownerDashboardController);

// Venues
router
  .route('/venues')
  .post(
    requireOwnerVerification,
    upload.array('images', 10),
    parseVenueFormData,
    validateInputs(createVenueSchema),
    venueController.createVenue
  )
  .get(validateQuery(getOwnerVenuesQuerySchema), venueController.getOwnerVenues);

router
  .route('/venues/:id')
  .all(validateObjectId('id'))
  .get(venueController.getVenueById)
  .patch(
    requireOwnerVerification,
    upload.array('images', 10),
    parseVenueFormData,
    validateInputs(updateVenueSchema),
    venueController.updateVenue
  )
  .delete(requireOwnerVerification, venueController.softDeleteVenue);

router
  .route('/venues/:id/restore')
  .all(validateObjectId('id'))
  .patch(requireOwnerVerification, venueController.restoreVenue);

import * as availabilityController from '@/controllers/availability.controller';
import { updateAvailabilitySchema } from '@/dto/availability/update-availability.dto';

router
  .route('/venues/:id/availability')
  .all(validateObjectId('id'))
  .get(availabilityController.getAvailability)
  .post(
    requireOwnerVerification,
    validateInputs(updateAvailabilitySchema),
    availabilityController.createAvailability
  )
  .put(
    requireOwnerVerification,
    validateInputs(updateAvailabilitySchema),
    availabilityController.updateAvailability
  );

// Bookings
router.get('/bookings', bookingController.getOwnerBookings);
router.get('/bookings/:bookingId', validateObjectId('bookingId'), bookingController.getOwnerBookingById);
router.patch(
  '/bookings/:bookingId/status',
  validateObjectId('bookingId'),
  requireOwnerVerification,
  bookingController.updateOwnerBookingStatus
);

export default router;
