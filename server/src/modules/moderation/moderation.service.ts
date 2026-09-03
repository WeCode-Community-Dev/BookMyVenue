import type { ModerationSummary } from './moderation.types';
import * as repo from './moderation.repository';

export async function getModerationSummary(): Promise<ModerationSummary> {
  // Get top 10 flagged/removed reviews
  const flaggedReviews = await repo.getTopFlaggedReviews(10);

  // Get top 10 pending hide requests
  const hideRequests = await repo.getTopHideRequests(10);

  // Get top 10 suspended venues
  const suspendedVenues = await repo.getTopSuspendedVenues(10);

  // Get top 10 banned users
  const bannedUsers = await repo.getTopBannedUsers(10);

  return {
    flaggedReviews: flaggedReviews.map((r) => ({
      _id: r._id.toString(),
      rating: r.rating,
      comment: r.comment,
      venueId: r.venueId._id.toString(),
      venueName: r.venueId.name,
      userId: r.userId._id.toString(),
      userName: r.userId.username,
      moderationReason: r.moderationReason,
      moderatedAt: r.moderatedAt,
      createdAt: r.createdAt,
    })),
    hideRequests: hideRequests.map((r) => ({
      _id: r._id.toString(),
      rating: r.rating,
      comment: r.comment,
      venueId: r.venueId._id.toString(),
      venueName: r.venueId.name,
      ownerId: r.venueId.ownerUserId._id.toString(),
      ownerUsername: r.venueId.ownerUserId.username,
      ownerEmail: r.venueId.ownerUserId.email,
      userId: r.userId._id.toString(),
      userName: r.userId.username,
      userEmail: r.userId.email,
      hideRequestReason: r.hideRequestReason,
      hideRequestedAt: r.hideRequestedAt,
      createdAt: r.createdAt,
    })),
    suspendedVenues: suspendedVenues.map((v) => ({
      _id: v._id.toString(),
      name: v.name,
      suspensionReason: v.suspensionReason,
      ownerUserId: v.ownerUserId.toString(),
      suspendedAt: v.updatedAt ?? v.createdAt,
      createdAt: v.createdAt,
    })),
    bannedUsers: bannedUsers.map((u) => ({
      _id: u._id.toString(),
      userId: u.userId._id.toString(),
      username: u.userId.username,
      email: u.userId.email,
      scope: u.scope,
      banReason: u.reason,
      bannedBy: u.bannedBy?.username ?? u.bannedBy?._id.toString(),
      bannedAt: u.bannedAt,
      expiresAt: u.expiresAt,
      venueId: u.venueId?.toString(),
      createdAt: u.createdAt,
    })),
  };
}
