import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import { buildPaginationMeta } from '../../utils/paginationUtils';
import { WishlistModel, type IWishlistItem } from './wishlist.model';
import { VenueModel } from '../venue/venue.model';
import type { IVenue } from '../venue/venue.types';
import mongoose from 'mongoose';

const toObjectId = (id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};

export async function addToWishlist(userId: string, venueId: string): Promise<IWishlistItem> {
  const result = await WishlistModel.findOneAndUpdate(
    { userId: toObjectId(userId), venueId: toObjectId(venueId) },
    { userId: toObjectId(userId), venueId: toObjectId(venueId) },
    { upsert: true, new: true }
  ).exec();

  return result;
}

export async function removeFromWishlist(userId: string, venueId: string): Promise<void> {
  await WishlistModel.deleteOne({
    userId: toObjectId(userId),
    venueId: toObjectId(venueId),
  }).exec();
}

export async function isWishlisted(userId: string, venueId: string): Promise<boolean> {
  const result = await WishlistModel.exists({
    userId: toObjectId(userId),
    venueId: toObjectId(venueId),
  }).exec();

  return !!result;
}

export async function findUserWishlist(
  userId: string,
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IVenue, 'venues'>> {
  const { limit, skip } = paginationParams;

  const [venues, total] = await Promise.all([
    WishlistModel.find({ userId: toObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'venueId',
        model: VenueModel,
        match: { active: true, deleted: false, status: 'Approved' },
        select:
          '_id name description venueType city district coverImage maxCapacity avgRating reviewCount flexibleBooking amenities pricing fixedPackages bookingType',
      })
      .lean()
      .exec()
      .then((items) => items.map((item) => item.venueId as unknown as IVenue).filter(Boolean)),

    WishlistModel.countDocuments({ userId: toObjectId(userId) }).exec(),
  ]);

  return {
    venues,
    pagination: buildPaginationMeta(total, paginationParams),
  };
}

export async function getWishlistedVenueIds(
  userId: string,
  venueIds: string[]
): Promise<Set<string>> {
  const wishlisted = await WishlistModel.find({
    userId: toObjectId(userId),
    venueId: { $in: venueIds.map(toObjectId) },
  })
    .select('venueId')
    .lean()
    .exec();

  return new Set(wishlisted.map((item) => item.venueId.toString()));
}
