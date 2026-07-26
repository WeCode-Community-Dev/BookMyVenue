export interface ModerationSummary {
  flaggedReviews: Array<{
    _id: string;
    venueId: string;
    venueName: string;
    userName: string;
    rating: number;
    comment: string;
    moderationReason?: string;
    moderatedAt?: string;
    createdAt: string;
  }>;
  hideRequests: Array<{
    _id: string;
    venueId: string;
    venueName: string;
    ownerUsername: string;
    ownerEmail: string;
    userName: string;
    userEmail: string;
    rating: number;
    comment: string;
    hideRequestReason: string;
    hideRequestedAt: string;
  }>;
  suspendedVenues: Array<{
    _id: string;
    name: string;
    suspensionReason: string;
    suspendedAt: string;
  }>;
  bannedUsers: Array<{
    _id: string;
    userId: string;
    username: string;
    email: string;
    scope: string;
    banReason: string;
    bannedAt: string;
  }>;
}
