import * as venueService from '@/services/venue.service';
import { Request, Response, NextFunction } from 'express';
import '@/models/owner.model';
import { HTTP_STATUS } from '@/constants/http';
import { MESSAGES } from '@/constants/messages';
import success from '@/utils/response';

// GET /admin/venues
export const getAdminVenues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await venueService.getAllVenuesForAdmin(res.locals.validateQuery);

    return success(res, HTTP_STATUS.OK, result, MESSAGES.VENUES_FETCHED);
  } catch (error) {
    next(error);
  }
};

// GET /admin/venues/:id
export const getAdminVenueById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const venue = await venueService.getVenueByIdForAdmin(id as string);

    return success(res, HTTP_STATUS.OK, venue, MESSAGES.VENUES_FETCHED);
  } catch (error) {
    next(error);
  }
};

// PATCH /admin/venues/:id/approve
export const approveVenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const venue = await venueService.approveVenue(id as string);

    return success(res, HTTP_STATUS.OK, venue, MESSAGES.VENUE_APPROVED);
  } catch (error) {
    next(error);
  }
};

// PATCH /admin/venues/:id/reject
export const rejectVenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const venue = await venueService.rejectVenue(id as string, rejectionReason);

    return success(res, HTTP_STATUS.OK, venue, MESSAGES.VENUE_REJECTED);
  } catch (error) {
    next(error);
  }
};

import { logAdminAction } from '@/utils/auditLogger';

// PATCH /admin/venues/:id/feature
export const toggleFeatured = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    const adminId = req.user?.id;

    const venue = await venueService.toggleVenueFeaturedService(id as string, Boolean(isFeatured));

    if (adminId) {
      await logAdminAction(adminId, isFeatured ? 'FEATURE_VENUE' : 'UNFEATURE_VENUE', 'VENUE', id as string);
    }

    return success(res, HTTP_STATUS.OK, venue, `Venue featured status updated to ${Boolean(isFeatured)}`);
  } catch (error) {
    next(error);
  }
};

// PATCH /admin/venues/:id/elite
export const toggleElite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isElite } = req.body;
    const adminId = req.user?.id;

    const venue = await venueService.toggleVenueEliteService(id as string, Boolean(isElite));

    if (adminId) {
      await logAdminAction(adminId, isElite ? 'MARK_VENUE_ELITE' : 'UNMARK_VENUE_ELITE', 'VENUE', id as string);
    }

    return success(res, HTTP_STATUS.OK, venue, `Venue elite status updated to ${Boolean(isElite)}`);
  } catch (error) {
    next(error);
  }
};
