import * as availabilityService from '@/services/availability.service';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@/constants/http';
import { AppError } from '@/utils/AppError';
import { MESSAGES } from '@/constants/messages';
import success from '@/utils/response';

// GET /owner/venues/:id/availability
export const getAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const venueId = req.params.id as string;
    const ownerId = req.user?.id;

    if (!ownerId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const availability = await availabilityService.getAvailability(ownerId, venueId);

    return success(res, HTTP_STATUS.OK, availability, 'Availability fetched successfully');
  } catch (error) {
    next(error);
  }
};

// POST /owner/venues/:id/availability
export const createAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const venueId = req.params.id as string;
    const ownerId = req.user?.id;
    const data = req.body;

    if (!ownerId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const availability = await availabilityService.createAvailability(ownerId, venueId, data);

    return success(res, HTTP_STATUS.CREATED, availability, 'Availability configured successfully');
  } catch (error) {
    next(error);
  }
};

// PUT /owner/venues/:id/availability
export const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const venueId = req.params.id as string;
    const ownerId = req.user?.id;
    const data = req.body;

    if (!ownerId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const availability = await availabilityService.updateAvailability(ownerId, venueId, data);

    return success(res, HTTP_STATUS.OK, availability, 'Availability updated successfully');
  } catch (error) {
    next(error);
  }
};
