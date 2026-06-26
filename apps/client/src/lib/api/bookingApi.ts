import type { CreateBookingBody, GetBookingQuery, OwnerBookingResponse, UserBookingsResponse } from "@bookmyvenue/types";

const API_BASE = "http://127.0.0.1:4000";

export const createBooking = async (payload: CreateBookingBody, token: string) => {
    const res = await fetch(`${API_BASE}/booking/create-booking`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to create booking");
    }

    return res.json();
};

// Get all booking of venues for owner
export const fetchBookingsByOwnerId = async (
    params: GetBookingQuery = {},
    token: string,
): Promise<OwnerBookingResponse> => {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const res = await fetch(`${API_BASE}/booking/owner/bookings`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to create booking");
    }

    return res.json();
};

// Bookings made by user
export const fetchBookingsByUserId = async (
    params: GetBookingQuery = {},
    token: string,
): Promise<UserBookingsResponse> => {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const res = await fetch(`${API_BASE}/booking/user/bookings`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to create booking");
    }

    return res.json();
};
