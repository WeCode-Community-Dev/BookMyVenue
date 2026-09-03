import * as repo from './wishlist.repository';
import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import type { IVenue } from '../venue/venue.types';
import { venueExists, findVenuesByIds } from '../venue/venue.repository';
import { NotFoundError } from '../../utils/errors';
import type { WishlistResponse, WishlistStatusResponse } from './wishlist.types';

export async function toggleWishlist(userId: string, venueId: string): Promise<WishlistResponse> {
  // Verify venue exists
  const venueExistsFlag = await venueExists(venueId);
  if (!venueExistsFlag) {
    throw new NotFoundError('Venue not found');
  }

  // Check if already wishlisted
  const isCurrentlyWishlisted = await repo.isWishlisted(userId, venueId);

  if (isCurrentlyWishlisted) {
    // Remove from wishlist
    await repo.removeFromWishlist(userId, venueId);
    return { wishlisted: false };
  } else {
    // Add to wishlist
    await repo.addToWishlist(userId, venueId);
    return { wishlisted: true };
  }
}

export async function syncWishlist(
  userId: string,
  venueIds: string[]
): Promise<WishlistStatusResponse> {
  if (!venueIds.length) return {};

  const existingVenues = await findVenuesByIds(venueIds);
  const validVenueIds = existingVenues.map((v: { _id: { toString(): string } }) =>
    v._id.toString()
  );

  await Promise.all(validVenueIds.map((venueId: string) => repo.addToWishlist(userId, venueId)));

  return getWishlistStatus(userId, venueIds);
}

export async function getMyWishlist(
  userId: string,
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IVenue, 'venues'>> {
  return repo.findUserWishlist(userId, paginationParams);
}

export async function getWishlistStatus(
  userId: string,
  venueIds: string[]
): Promise<WishlistStatusResponse> {
  if (!venueIds.length) return {};

  const wishlisted = await repo.getWishlistedVenueIds(userId, venueIds);

  return venueIds.reduce<WishlistStatusResponse>((acc, venueId) => {
    acc[venueId] = wishlisted.has(venueId);
    return acc;
  }, {});
}
