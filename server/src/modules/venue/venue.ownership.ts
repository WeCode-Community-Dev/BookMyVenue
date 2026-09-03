import type { IVenue } from './venue.types';
import { ForbiddenError, NotFoundError } from '../../utils/errors';
import { findVenueById } from './venue.repository';

export function assertVenueOwner(venue: IVenue, userId: string): void {
  if (venue.ownerUserId.toString() !== userId) {
    throw new ForbiddenError('You do not have permission to modify this venue');
  }
}

export async function requireOwnVenue(venueId: string, userId: string): Promise<IVenue> {
  const venue = await findVenueById(venueId);

  if (!venue) {
    throw new NotFoundError('Venue not found');
  }

  assertVenueOwner(venue, userId);

  const { isBannedForScope } = await import('../moderation/bannedUser.service.js');
  const isBanned = await isBannedForScope(userId, 'owner_dashboard', venueId);
  if (isBanned) {
    throw new ForbiddenError(
      'You are currently banned from accessing the owner dashboard for this venue.'
    );
  }

  return venue;
}
