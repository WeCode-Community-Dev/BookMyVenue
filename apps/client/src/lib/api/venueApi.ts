const API_BASE = "http://127.0.0.1:4000";
import type {
    CreateVenuePayload,
    GetVenueByIdResponse,
    GetVenuesQuery,
    GetVenuesResponse,
} from "@bookmyvenue/types";

export async function getVenuesApi(params: GetVenuesQuery = {}): Promise<GetVenuesResponse> {
    const query = new URLSearchParams();
    if (params.district) query.set("district", params.district);
    if (params.category) query.set("category", params.category);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const res = await fetch(`${API_BASE}/venue/${qs ? `?${qs}` : ""}`);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to fetch venues");
    }

    return res.json();
}

export async function getVenueByIdApi(id: number | string): Promise<GetVenueByIdResponse> {
    const res = await fetch(`${API_BASE}/venue/${id}`);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to fetch venue");
    }

    return res.json();
}

export async function createVenueApi(payload: CreateVenuePayload, token: string) {
    const res = await fetch(`${API_BASE}/venue/create-venue`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to create venue");
    }

    return res.json();
}
