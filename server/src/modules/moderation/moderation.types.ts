import type { Types } from 'mongoose';

export interface FlaggedReviewLean {
  _id: Types.ObjectId;
  rating: number;
  comment?: string;
  venueId: { _id: Types.ObjectId; name: string };
  userId: { _id: Types.ObjectId; username: string };
  moderationReason?: string;
  moderatedAt?: Date;
  createdAt: Date;
}

export interface HideRequestLean {
  _id: Types.ObjectId;
  rating: number;
  comment?: string;
  venueId: {
    _id: Types.ObjectId;
    name: string;
    ownerUserId: { _id: Types.ObjectId; username: string; email: string };
  };
  userId: { _id: Types.ObjectId; username: string; email: string };
  hideRequestReason?: string;
  hideRequestedAt?: Date;
  createdAt: Date;
}

export interface SuspendedVenueLean {
  _id: Types.ObjectId;
  name: string;
  suspensionReason?: string;
  ownerUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BannedUserLean {
  _id: Types.ObjectId;
  userId: { _id: Types.ObjectId; username: string; email: string };
  scope: string;
  reason: string;
  bannedAt: Date;
  expiresAt?: Date | null;
  bannedBy?: { _id: Types.ObjectId; username: string; email: string };
  venueId?: Types.ObjectId | null;
  createdAt: Date;
}

export interface ModerationSummary {
  flaggedReviews: {
    _id: string;
    rating: number;
    comment?: string;
    venueId: string;
    venueName?: string;
    userId: string;
    userName?: string;
    moderationReason?: string;
    moderatedAt?: Date;
    createdAt: Date;
  }[];
  hideRequests: {
    _id: string;
    rating: number;
    comment?: string;
    venueId: string;
    venueName?: string;
    ownerId: string;
    ownerUsername?: string;
    ownerEmail?: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    hideRequestReason?: string;
    hideRequestedAt?: Date;
    createdAt: Date;
  }[];
  suspendedVenues: {
    _id: string;
    name: string;
    suspensionReason?: string;
    ownerUserId: string;
    suspendedAt?: Date;
    createdAt: Date;
  }[];
  bannedUsers: {
    _id: string;
    userId: string;
    username: string;
    email: string;
    scope: string;
    banReason: string;
    bannedBy?: string;
    bannedAt: Date;
    expiresAt?: Date | null;
    venueId?: string | null;
    createdAt: Date;
  }[];
}
