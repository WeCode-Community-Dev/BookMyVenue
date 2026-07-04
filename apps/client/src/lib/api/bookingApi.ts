import type {
    CreateBookingBody,
    GetOwnerBookingQuery,
    OwnerBookingResponse,
    UserBookingsResponse,
    GetUserBookingQuery,
    OwnerDashboardResponse,
} from "@bookmyvenue/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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
    params: GetOwnerBookingQuery = {},
    token: string,
): Promise<OwnerBookingResponse> => {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const res = await fetch(`${API_BASE}/booking/owner/bookings${qs ? `?${qs}` : ""}`, {
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

export const fetchOwnerDashboard = async (token: string): Promise<OwnerDashboardResponse> => {
    const res = await fetch(`${API_BASE}/owner/dashboard`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to fetch bookings overview");
    }

    return res.json();
};

// Bookings made by user
export const fetchBookingsByUserId = async (
    params: GetUserBookingQuery,
    token: string,
): Promise<UserBookingsResponse> => {
    const query = new URLSearchParams();
    query.set("today", String(params.today));
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.type) query.set("type", params.type);

    const qs = query.toString();
    const res = await fetch(`${API_BASE}/booking/user/bookings${qs ? `?${qs}` : ""}`, {
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
