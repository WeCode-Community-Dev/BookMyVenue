import type { Request, Response } from 'express';
import { findVenueById } from '../venue/venue.repository';
import { fetchActiveConflicts } from '../booking/booking.repository';
import { generateAvailability, getBookableDates } from './availability.workflow';
import { ResponseUtil } from '../../utils/responseUtils';
import { logError, logInfo } from '../../utils/logger';
import crypto from 'crypto';
import { validateDateForVenue, type VenueIdParamDTO } from '../booking/booking.validator';
import type { AvailabilityQueryDTO } from './availability.validator';

export const getVenueAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = req.validated;
    if (!validated?.params) {
      ResponseUtil.badRequest(res, 'Validation failed');
      return;
    }

    const { id } = validated.params as VenueIdParamDTO;
    const { date } = validated.query as AvailabilityQueryDTO;

    const venue = await findVenueById(id);
    if (!venue) {
      ResponseUtil.notFound(res, 'Venue not found');
      return;
    }

    // Only Approved, active, non-deleted venues expose availability.
    // Return 404 (not 403) to avoid leaking venue existence for non-public venues.
    if (venue.status !== 'Approved' || !venue.active || venue.deleted) {
      ResponseUtil.notFound(res, 'Venue not found');
      return;
    }

    if (!date) {
      const bookableData = getBookableDates(venue);
      ResponseUtil.success(res, 'Bookable dates calculated successfully', bookableData);
      return;
    }

    const dateCheck = validateDateForVenue(venue, date);
    if (!dateCheck.valid) {
      ResponseUtil.badRequest(res, dateCheck.reason ?? 'This date is not available for booking.');
      return;
    }

    const sessionToken = req.headers['x-session-token'] as string | undefined;
    const sessionTokenHash = sessionToken
      ? crypto.createHash('sha256').update(sessionToken).digest('hex')
      : undefined;
    const userId = req.user?.userId;

    logInfo('Availability check: self-lock exclusion parameters extracted', {
      venueId: id,
      date,
      userId: userId ?? 'Unauthenticated',
      hasSessionToken: !!sessionToken,
      sessionTokenHash,
    });

    // Fetch active conflicts (Bookings and locks)
    const conflicts = await fetchActiveConflicts(id, date, {
      excludeUserId: userId,
      excludeSessionTokenHash: sessionTokenHash,
    });

    // Calculate availability data
    const availabilityData = generateAvailability(venue, date, conflicts);
    ResponseUtil.success(res, 'Availability calculated successfully', availabilityData);
    return;
  } catch (error) {
    logError('Error computing availability', error as Record<string, unknown>);
    ResponseUtil.serverUnavailable(res, 'Failed to compute availability');
    return;
  }
};
