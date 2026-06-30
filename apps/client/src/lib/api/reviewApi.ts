import { GetVenueReviewStatusResponse, WriteReviewBody } from "@bookmyvenue/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const fetchVenueReviewStatus = async (
    venueId: string,
    token: string,
): Promise<GetVenueReviewStatusResponse> => {
    const res = await fetch(`${API_BASE}/review/${venueId}/review-status`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to fetch bookings");
    }

    return res.json();
};

export const writeReview = async (payload: WriteReviewBody, token: string) => {
    const response = await fetch(`${API_BASE}/review/write-review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Failed to submit review");
    }

    return response.json();
};
