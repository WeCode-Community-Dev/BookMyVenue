export type ReviewStatus =
    | "NOT_LOGGED_IN"
    | "NO_BOOKING"
    | "BOOKING_UPCOMING"
    | "CAN_REVIEW"
    | "ALREADY_REVIEWED";

export type GetVenueReviewStatusQuery = {
    today: string;
    page?: number;
    limit?: number;
};

export type GetVenueReviewStatusResponse = {
    reviewStatus: ReviewStatus;
};

export type WriteReviewBody = {
    venueId: number;
    rating: number;
    comment?: string;
};

export type GetReviewsQuery = {
    page?: number;
    limit?: number;
};

export type ReviewUser = {
    name: string;
};

export type ReviewResponse = {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: ReviewUser;
};

export type GetReviewsResponse = {
    success: true;
    reviews: ReviewResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};
