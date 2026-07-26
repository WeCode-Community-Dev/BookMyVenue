export interface ReviewDTO {
  rating?: number;
  comment?: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  comment?: string;
}

export interface Review {
  _id: string;
  venueId: string;
  user: {
    id: string;
    userName: string;
    isVerified?: boolean;
  };
  rating?: number;
  comment?: string;
  createdAt: string;
  editedAt?: string;
  reviewerRating?: number;
  ownerReply?: {
    text: string;
    repliedAt: string;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
