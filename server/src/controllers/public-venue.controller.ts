import * as venueService from '@/services/venue.service';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@/constants/http';
import { MESSAGES } from '@/constants/messages';
import success from '@/utils/response';

// GET /venues
export const getPublicVenues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await venueService.getPublicVenues(res.locals.validateQuery);

    return success(res, HTTP_STATUS.OK, result, MESSAGES.VENUES_FETCHED);
  } catch (error) {
    next(error);
  }
};

// GET /venues/:id
export const getPublicVenueById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const venue = await venueService.getPublicVenueById(id as string);

    return success(res, HTTP_STATUS.OK, venue, MESSAGES.VENUES_FETCHED);
  } catch (error) {
    next(error);
  }
};
