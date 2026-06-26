import type { CreateBookingBody } from "@bookmyvenue/types";

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
