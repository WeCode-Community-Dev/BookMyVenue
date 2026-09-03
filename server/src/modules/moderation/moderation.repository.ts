import { ReviewModel } from '../review/review.model';
import { VenueModel } from '../venue/venue.model';
import { BannedUserModel } from './bannedUser.model';
import type {
  FlaggedReviewLean,
  HideRequestLean,
  SuspendedVenueLean,
  BannedUserLean,
} from './moderation.types';

export async function getTopFlaggedReviews(limit = 10): Promise<FlaggedReviewLean[]> {
  return ReviewModel.find({
    status: 'flagged',
  })
    .sort({ moderatedAt: -1, createdAt: -1 })
    .limit(limit)
    .populate('userId', 'username')
    .populate('venueId', 'name')
    .lean()
    .exec() as unknown as Promise<FlaggedReviewLean[]>;
}

export async function getTopHideRequests(limit = 10): Promise<HideRequestLean[]> {
  return ReviewModel.find({
    hideRequestStatus: 'pending',
  })
    .sort({ hideRequestedAt: -1 })
    .limit(limit)
    .populate('userId', 'username email')
    .populate({
      path: 'venueId',
      select: 'name ownerUserId',
      populate: { path: 'ownerUserId', select: 'username email' },
    })
    .lean()
    .exec() as unknown as Promise<HideRequestLean[]>;
}

export async function getTopSuspendedVenues(limit = 10): Promise<SuspendedVenueLean[]> {
  return VenueModel.find({
    status: 'Suspended',
    deleted: false,
  })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select('_id name suspensionReason ownerUserId createdAt updatedAt')
    .lean()
    .exec();
}

export async function getTopBannedUsers(limit = 10): Promise<BannedUserLean[]> {
  return BannedUserModel.find({
    status: 'active',
  })
    .sort({ bannedAt: -1 })
    .limit(limit)
    .populate('userId', 'username email')
    .populate('bannedBy', 'username email')
    .lean()
    .exec() as unknown as Promise<BannedUserLean[]>;
}
