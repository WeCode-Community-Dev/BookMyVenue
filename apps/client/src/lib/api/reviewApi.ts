import { GetVenueReviewStatusResponse, WriteReviewBody, GetReviewsResponse } from "@bookmyvenue/types";

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
    const res = await fetch(`${API_BASE}/review/write-review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message ?? "Failed to submit review");
    }

    return res.json();
};

export async function getReviews(venueId: number, page = 1, limit = 10): Promise<GetReviewsResponse> {
    const query = new URLSearchParams();
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    const qs = query.toString();

    const res = await fetch(`${API_BASE}/review/${venueId}/reviews${qs ? `?${qs}` : ""}`);

    if (!res.ok) {
        throw new Error("Failed to fetch reviews");
    }

    return res.json();
}
