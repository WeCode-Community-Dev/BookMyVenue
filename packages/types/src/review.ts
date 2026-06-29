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
