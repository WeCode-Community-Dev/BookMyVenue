import * as repo from './review.repository';
import * as bookingRepo from '../booking/booking.repository';
import { isReviewEditableByOwner } from './review.ownership';
import type { UpdateReviewDTO, ModerateReviewDTO } from './review.types';
import type { IReview as IReviewModel } from './review.model';
import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import { VenueModel } from '../venue/venue.model';
import { ConflictError, NotFoundError, ValidationError } from '../../utils/errors';
import { logError, logWarn } from '../../utils/logger';
import { enqueueEmailTask } from '../../services/email.repository';
import { EmailIntent, EmailTaskStatus } from '../../constants/email.constants';

export async function submitReview(
  userId: string,
  venueId: string,
  dto: { rating?: number; comment?: string }
): Promise<IReviewModel> {
  if (!dto.rating && !dto.comment) {
    throw new ValidationError('Must provide either a rating or a comment');
  }

  if (dto.comment?.trim()) {
    const { isBannedForScope } = await import('../moderation/bannedUser.service.js');
    const isBanned = await isBannedForScope(userId, 'commenting', venueId);
    if (isBanned) {
      throw new ConflictError('You are currently banned from commenting.');
    }
  }

  if (dto.rating && (!Number.isInteger(dto.rating) || dto.rating < 1 || dto.rating > 5)) {
    throw new ValidationError('Rating must be an integer between 1 and 5');
  }

  let review: IReviewModel | null = null;

  if (dto.rating) {
    review = await repo.upsertRating(userId, venueId, dto.rating);
  }

  if (dto.comment?.trim()) {
    const commentReview = await repo.createComment(userId, venueId, dto.comment.trim());
    review ??= commentReview;
  }

  if (!review) {
    throw new ValidationError('Failed to create review');
  }

  if (dto.rating) {
    await recomputeVenueRating(venueId);
  }

  return review;
}

export async function upsertRating(
  userId: string,
  venueId: string,
  rating: number
): Promise<IReviewModel> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be an integer between 1 and 5');
  }
  const review = await repo.upsertRating(userId, venueId, rating);
  await recomputeVenueRating(venueId);
  return review;
}

export async function addComment(
  userId: string,
  venueId: string,
  comment: string
): Promise<IReviewModel> {
  if (!comment.trim()) {
    throw new ValidationError('Comment cannot be empty');
  }

  const { isBannedForScope } = await import('../moderation/bannedUser.service.js');
  const isBanned = await isBannedForScope(userId, 'commenting', venueId);
  if (isBanned) {
    throw new ConflictError('You are currently banned from commenting.');
  }

  return repo.createComment(userId, venueId, comment.trim());
}

export async function getMyRating(userId: string, venueId: string): Promise<number | null> {
  const ratings = await repo.findRatingsForUsers(venueId, [userId]);
  return ratings.get(userId) ?? null;
}

export async function updateReview(
  userId: string,
  reviewId: string,
  dto: UpdateReviewDTO,
  requesterRole?: string
): Promise<IReviewModel> {
  const review = await repo.findReviewById(reviewId);
  if (!review) {
    throw new NotFoundError('Review not found');
  }

  const isAdmin = requesterRole === 'admin' || requesterRole === 'superAdmin';
  const isOwner = review.userId.toString() === userId;

  if (!isOwner && !isAdmin) {
    throw new NotFoundError('Review not found');
  }

  if (!isAdmin) {
    const isEditable = await isReviewEditableByOwner(reviewId, userId);
    if (!isEditable) {
      throw new ValidationError('Review can only be edited within 30 days of creation');
    }

    if (dto.comment?.trim()) {
      const { isBannedForScope } = await import('../moderation/bannedUser.service.js');
      const isBanned = await isBannedForScope(userId, 'commenting', review.venueId.toString());
      if (isBanned) {
        throw new ConflictError('You are currently banned from commenting.');
      }
    }
  }

  const updated = await repo.updateReview(reviewId, dto);
  if (!updated) {
    throw new NotFoundError('Review not found');
  }

  if (dto.rating !== undefined) {
    await recomputeVenueRating(updated.venueId.toString());
  }

  return updated;
}

export async function deleteReview(
  userId: string,
  reviewId: string,
  requesterRole?: string
): Promise<void> {
  const review = await repo.findReviewById(reviewId);
  if (!review) {
    throw new NotFoundError('Review not found');
  }

  const isAdmin = requesterRole === 'admin' || requesterRole === 'superAdmin';
  const isOwner = review.userId.toString() === userId;

  if (!isOwner && !isAdmin) {
    throw new NotFoundError('Review not found');
  }

  if (!isAdmin) {
    const isEditable = await isReviewEditableByOwner(reviewId, userId);
    if (!isEditable) {
      throw new ValidationError('Review can only be deleted within 30 days of creation');
    }
  }

  const venueId = review.venueId.toString();
  await repo.deleteReview(reviewId);

  if (review.rating) {
    await recomputeVenueRating(venueId);
  }
}

// review.userId is populated with 'username' by repo.findVenueReviews, so it's
// a user sub-document (with _id), not a raw ObjectId — extract the real id.
function extractUserId(userId: unknown): string {
  if (userId && typeof userId === 'object' && '_id' in userId) {
    return (userId as { _id: { toString(): string } })._id.toString();
  }
  return (userId as { toString(): string }).toString();
}

export async function getVenueReviews(
  venueId: string,
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IReviewModel, 'reviews'>> {
  const result = await repo.findVenueReviews(venueId, paginationParams);

  // Batch-fetch verified status and reviewer ratings
  const userIds = result.reviews.map((r) => extractUserId(r.userId));
  const [verifiedUserIds, reviewerRatings] = await Promise.all([
    bookingRepo.findVerifiedUserIds(venueId, userIds),
    repo.findRatingsForUsers(venueId, userIds),
  ]);

  // Enrich each review with verified status and reviewer's rating
  const enrichedReviews = result.reviews.map((review): IReviewModel => {
    const uid = extractUserId(review.userId);
    return {
      ...review.toObject(),
      isVerified: verifiedUserIds.has(uid),
      reviewerRating: reviewerRatings.get(uid),
    } as IReviewModel;
  });

  return {
    ...result,
    reviews: enrichedReviews,
  };
}

export async function getFlaggedReviews(
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IReviewModel, 'reviews'>> {
  return repo.findFlaggedReviews(paginationParams);
}

export async function moderateReview(
  reviewId: string,
  dto: ModerateReviewDTO,
  moderatorId: string
): Promise<IReviewModel> {
  // Validate inputs
  if (dto.action === 'flag' || dto.action === 'remove' || dto.action === 'approve_hide') {
    if (!dto.reason || dto.reason.trim().length === 0) {
      throw new ValidationError('Reason is required for flag/remove/approve actions');
    }
    if (dto.reason.length < 10) {
      throw new ValidationError('Reason must be at least 10 characters');
    }
  }

  const review = await repo.findReviewById(reviewId);
  if (!review) {
    throw new NotFoundError('Review not found');
  }

  const venue = await VenueModel.findById(review.venueId).select('name').lean().exec();
  const venueName = venue?.name ?? 'Unknown Venue';

  const updated =
    dto.action === 'approve_hide' || dto.action === 'reject_hide'
      ? await repo.resolveHideRequest(
          reviewId,
          dto.action === 'approve_hide' ? 'approve' : 'reject',
          moderatorId
        )
      : await repo.moderateReview(reviewId, dto, moderatorId);

  if (!updated) {
    throw new NotFoundError('Review not found');
  }

  // Recompute venue rating if moderation affected visibility
  if (dto.action === 'remove' || dto.action === 'restore' || dto.action === 'approve_hide') {
    await recomputeVenueRating(updated.venueId.toString());
  }

  // Send email notifications to review author
  if (dto.action === 'remove' || dto.action === 'approve_hide') {
    try {
      await enqueueEmailTask(
        updated.userId.toString(),
        EmailIntent.REVIEW_REMOVED,
        'Your Review Has Been Removed',
        EmailTaskStatus.PENDING,
        { venueName, reason: dto.reason ?? 'No reason provided' }
      );
    } catch (err) {
      logWarn('Failed to queue review removed email', {
        module: 'review.service.ts/moderateReview',
        reviewId,
        error: (err as Error).message,
      });
    }
  } else if (dto.action === 'restore') {
    try {
      await enqueueEmailTask(
        updated.userId.toString(),
        EmailIntent.REVIEW_RESTORED,
        'Your Review Has Been Restored',
        EmailTaskStatus.PENDING,
        { venueName }
      );
    } catch (err) {
      logWarn('Failed to queue review restored email', {
        module: 'review.service.ts/moderateReview',
        reviewId,
        error: (err as Error).message,
      });
    }
  }

  // Log activity
  if (dto.action === 'remove' || dto.action === 'restore' || dto.action === 'approve_hide') {
    const { logModerationAction } = await import('../moderation/moderationActivity.service.js');
    const actionType = dto.action === 'restore' ? 'restore_review' : 'remove_review';
    await logModerationAction(actionType, reviewId, 'review', {
      actorId: moderatorId,
      reason: dto.reason,
      metadata: {
        venueId: updated.venueId.toString(),
        userId: updated.userId.toString(),
      },
    });
  }

  return updated;
}

async function recomputeVenueRating(venueId: string): Promise<void> {
  try {
    const { avgRating, reviewCount } = await repo.getVenueRatingAggregate(venueId);

    await VenueModel.findByIdAndUpdate(venueId, {
      avgRating,
      reviewCount,
    }).exec();
  } catch (err) {
    const error = err as Error;
    logError('Failed to recompute venue rating', {
      module: 'review.service.ts/recomputeVenueRating',
      venueId,
      error: error.message,
    });
    // Non-blocking — continue without throwing
  }
}

export async function getUserReviewedBookings(userId: string): Promise<Set<string>> {
  return repo.findUserReviewedBookings(userId);
}

export async function getOwnerVenueReviews(
  venueId: string,
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IReviewModel, 'reviews'>> {
  return repo.findVenueReviewsForOwner(venueId, paginationParams);
}

export async function replyToReview(
  venueId: string,
  reviewId: string,
  text: string
): Promise<IReviewModel> {
  const review = await repo.findReviewById(reviewId);
  if (!review) throw new NotFoundError('Review not found');

  const { isBannedForScope } = await import('../moderation/bannedUser.service.js');
  const venue = await VenueModel.findById(venueId);
  if (venue) {
    const isBanned = await isBannedForScope(venue.ownerUserId.toString(), 'commenting', venueId);
    if (isBanned) {
      throw new ConflictError('You are currently banned from replying to reviews.');
    }
  }

  const updated = await repo.addOwnerReply(reviewId, venueId, text);
  if (!updated) {
    throw new NotFoundError('Review not found');
  }
  return updated;
}

export async function requestHideForReview(
  venueId: string,
  reviewId: string,
  ownerId: string,
  reason: string
): Promise<IReviewModel> {
  const review = await repo.findReviewById(reviewId);
  if (!review) {
    throw new NotFoundError('Review not found');
  }

  if (review.venueId.toString() !== venueId) {
    throw new NotFoundError('Review not found');
  }

  if (review.hideRequestStatus === 'pending') {
    throw new ConflictError('A hide request is already pending for this review');
  }

  const updated = await repo.requestHideReview(reviewId, venueId, ownerId, reason);
  if (!updated) {
    throw new NotFoundError('Review not found');
  }

  return updated;
}

export async function flagReview(reviewId: string, reason: string): Promise<IReviewModel> {
  const review = await repo.findReviewById(reviewId);
  if (!review) {
    throw new NotFoundError('Review not found');
  }

  const updated = await repo.flagReview(reviewId, reason);
  if (!updated) {
    throw new NotFoundError('Review not found');
  }

  // Recompute venue rating since the review is hidden
  if (review.rating) {
    await recomputeVenueRating(updated.venueId.toString());
  }

  return updated;
}

export async function getPendingHideRequests(
  paginationParams: PaginationParams
): Promise<PaginatedResponse<IReviewModel, 'reviews'>> {
  return repo.findPendingHideRequests(paginationParams);
}
