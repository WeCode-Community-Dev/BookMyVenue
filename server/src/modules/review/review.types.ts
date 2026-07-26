export interface IReview {
  _id: string;
  venueId: string;
  userId: string;
  bookingId?: string | null;
  rating?: number;
  comment?: string;
  status: 'visible' | 'flagged' | 'removed';
  moderationReason?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isVerified?: boolean;
  reviewerRating?: number;
}

export interface CreateReviewDTO {
  venueId: string;
  rating?: number;
  comment?: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  comment?: string;
}

export interface ModerateReviewDTO {
  action: 'flag' | 'remove' | 'restore' | 'approve_hide' | 'reject_hide';
  reason?: string;
}

export interface ReviewWithUserInfo extends IReview {
  user?: {
    username: string;
  };
}

export interface OwnerReplyDTO {
  text: string;
}

export interface RequestHideDTO {
  reason: string;
}
