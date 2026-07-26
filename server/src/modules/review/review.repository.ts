import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import { buildPaginationMeta } from '../../utils/paginationUtils';
import { ReviewModel, type IReview } from './review.model';
import type { UpdateReviewDTO, ModerateReviewDTO } from './review.types';
import mongoose from 'mongoose';

const toObjectId = (id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};

export async function upsertRating(
  userId: string,
  venueId: string,
  rating: number
): Promise<IReview> {
  const review = await ReviewModel.findOneAndUpdate(
    { userId: toObjectId(userId), venueId: toObjectId(venueId), rating: { $exists: true } },
    { rating, editedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  ).exec();
  return review;
}

export async function createComment(
  userId: string,
  venueId: string,
  comment: string
): Promise<IReview> {
  const review = new ReviewModel({
    userId: toObjectId(userId),
    venueId: toObjectId(venueId),
    comment,
    status: 'visible',
  });
  return review.save();
}

export async function findRatingsForUsers(
  venueId: string,
  userIds: string[]
): Promise<Map<string, number>> {
  if (userIds.length === 0) {
    return new Map();
  }

  const validUserIds = userIds.filter((id) => {
    try {
      toObjectId(id);
      return true;
    } catch {
      return false;
    }
  });

  if (validUserIds.length === 0) {
    return new Map();
  }

  const ratings = await ReviewModel.find({
    venueId: toObjectId(venueId),
    userId: { $in: validUserIds.map(toObjectId) },
    rating: { $exists: true },
    status: 'visible',
  })
    .select('userId rating')
    .exec();

  const map = new Map<string, number>();
  ratings.forEach((r) => {
    if (r.rating) map.set(r.userId.toString(), r.rating);
  });
  return map;
}

export async function updateReview(
  reviewId: string,
  dto: UpdateReviewDTO
): Promise<IReview | null> {
  const updates: Record<string, unknown> = { editedAt: new Date() };
  if (dto.rating !== undefined) updates.rating = dto.rating;
  if (dto.comment !== undefined) updates.comment = dto.comment;

  return ReviewModel.findByIdAndUpdate(toObjectId(reviewId), updates, {
    new: true,
    runValidators: true,
  }).exec();
}

export async function deleteReview(reviewId: string): Promise<void> {
  await ReviewModel.deleteOne({ _id: toObjectId(reviewId) }).exec();
}

export async function findVenueReviews(
  venueId: string,
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IReview, 'reviews'>> {
  const { limit, skip } = paginationParams;

  const [reviews, total] = await Promise.all([
    ReviewModel.find({
      venueId: toObjectId(venueId),
      status: 'visible',
      comment: { $exists: true, $ne: '' },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username')
      .exec(),

    ReviewModel.countDocuments({
      venueId: toObjectId(venueId),
      status: 'visible',
      comment: { $exists: true, $ne: '' },
    }).exec(),
  ]);

  return {
    reviews,
    pagination: buildPaginationMeta(total, paginationParams),
  };
}

export async function getVenueRatingAggregate(
  venueId: string
): Promise<{ avgRating: number; reviewCount: number }> {
  const result = await ReviewModel.aggregate([
    {
      $match: {
        venueId: toObjectId(venueId),
        status: 'visible',
        rating: { $exists: true },
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]).exec();

  if (!result.length) {
    return { avgRating: 0, reviewCount: 0 };
  }

  const agg = result[0] as { avgRating: number; reviewCount: number };
  return {
    avgRating: Math.round(agg.avgRating * 10) / 10,
    reviewCount: agg.reviewCount,
  };
}

export async function findReviewById(reviewId: string): Promise<IReview | null> {
  return ReviewModel.findById(toObjectId(reviewId)).exec();
}

export async function moderateReview(
  reviewId: string,
  dto: ModerateReviewDTO,
  moderatorId: string
): Promise<IReview | null> {
  const updates: Record<string, unknown> = {
    moderatedBy: toObjectId(moderatorId),
    moderatedAt: new Date(),
  };

  if (dto.action === 'flag') {
    updates.status = 'flagged';
    updates.moderationReason = dto.reason;
  } else if (dto.action === 'remove') {
    updates.status = 'removed';
    updates.moderationReason = dto.reason;
  } else if (dto.action === 'restore') {
    updates.status = 'visible';
    updates.moderationReason = null;
  }

  return ReviewModel.findByIdAndUpdate(toObjectId(reviewId), updates, { new: true }).exec();
}

export async function findFlaggedReviews(
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IReview, 'reviews'>> {
  const { limit, skip } = paginationParams;

  const [reviews, total] = await Promise.all([
    ReviewModel.find({
      $or: [{ status: 'flagged' }, { status: 'removed' }],
    })
      .sort({ moderatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username')
      .populate('venueId', 'name')
      .exec(),

    ReviewModel.countDocuments({
      $or: [{ status: 'flagged' }, { status: 'removed' }],
    }).exec(),
  ]);

  return {
    reviews,
    pagination: buildPaginationMeta(total, paginationParams),
  };
}

export async function findUserReviewedBookings(userId: string): Promise<Set<string>> {
  const reviews = await ReviewModel.find({
    userId: toObjectId(userId),
    bookingId: { $exists: true },
  })
    .select('bookingId')
    .lean()
    .exec();

  const bookingIds = reviews
    .map((r) => {
      if (r.bookingId) return r.bookingId.toString();
      return null;
    })
    .filter((id): id is string => id !== null);
  return new Set(bookingIds);
}

export async function findVenueReviewsForOwner(
  venueId: string,
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IReview, 'reviews'>> {
  const { limit, skip } = paginationParams;

  const [reviews, total] = await Promise.all([
    ReviewModel.find({ venueId: toObjectId(venueId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email')
      .exec(),

    ReviewModel.countDocuments({ venueId: toObjectId(venueId) }).exec(),
  ]);

  return {
    reviews,
    pagination: buildPaginationMeta(total, paginationParams),
  };
}

export async function addOwnerReply(
  reviewId: string,
  venueId: string,
  text: string
): Promise<IReview | null> {
  return ReviewModel.findOneAndUpdate(
    { _id: toObjectId(reviewId), venueId: toObjectId(venueId) },
    {
      ownerReply: {
        text,
        repliedAt: new Date(),
      },
    },
    { new: true }
  ).exec();
}

export async function requestHideReview(
  reviewId: string,
  venueId: string,
  ownerId: string,
  reason: string
): Promise<IReview | null> {
  return ReviewModel.findOneAndUpdate(
    { _id: toObjectId(reviewId), venueId: toObjectId(venueId) },
    {
      hideRequestedBy: toObjectId(ownerId),
      hideRequestReason: reason,
      hideRequestedAt: new Date(),
      hideRequestStatus: 'pending',
    },
    { new: true }
  ).exec();
}

export async function flagReview(reviewId: string, reason: string): Promise<IReview | null> {
  return ReviewModel.findByIdAndUpdate(
    toObjectId(reviewId),
    {
      status: 'flagged',
      moderationReason: reason,
    },
    { new: true }
  ).exec();
}

export async function findPendingHideRequests(
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IReview, 'reviews'>> {
  const { limit, skip } = paginationParams;

  const [reviews, total] = await Promise.all([
    ReviewModel.find({ hideRequestStatus: 'pending' })
      .sort({ hideRequestedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email')
      .populate({
        path: 'venueId',
        select: 'name ownerUserId',
        populate: { path: 'ownerUserId', select: 'username email' },
      })
      .exec(),

    ReviewModel.countDocuments({ hideRequestStatus: 'pending' }).exec(),
  ]);

  return {
    reviews,
    pagination: buildPaginationMeta(total, paginationParams),
  };
}

export async function resolveHideRequest(
  reviewId: string,
  action: 'approve' | 'reject',
  adminId: string
): Promise<IReview | null> {
  const updates: Record<string, unknown> = {};

  if (action === 'approve') {
    updates.status = 'removed';
    updates.hideRequestStatus = 'approved';
    updates.moderatedBy = toObjectId(adminId);
    updates.moderatedAt = new Date();
  } else {
    updates.hideRequestStatus = 'rejected';
  }

  return ReviewModel.findByIdAndUpdate(toObjectId(reviewId), updates, { new: true }).exec();
}
