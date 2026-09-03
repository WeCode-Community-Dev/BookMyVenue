import type { NextFunction, Request, Response } from 'express';
import { requireOwnVenue } from '../modules/venue/venue.ownership';
import { ResponseUtil } from '../utils/responseUtils';

export const ownerTenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const venueId = req.params.venueId || (req.body as Record<string, unknown>).venueId;
    const userId = req.user?.userId;

    if (!userId) {
      ResponseUtil.unauthorized(res);
      return;
    }

    if (!venueId) {
      ResponseUtil.badRequest(res, 'Venue ID is required');
      return;
    }
    // This will throw NotFoundError (404) or ForbiddenError (403) if validation fails
    const venue = await requireOwnVenue(venueId as string, userId);
    Object.assign(req, { venue });

    next();
  } catch (error) {
    next(error);
  }
};
