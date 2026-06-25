const API_BASE = "http://127.0.0.1:4000";

export interface SessionInput {
    label: string;
    startTime: string;
    endTime: string;
    price: number;
}

export interface CreateVenuePayload {
    name: string;
    description: string;
    capacity: number;
    category: string;
    location: string;
    district: string;
    images: string[];
    amenities: string[];
    sessions: SessionInput[];
}

export interface VenueSession {
    id: number;
    label: string;
    startTime: string;
    endTime: string;
    price: number;
}

export interface Venue {
    id: number;
    name: string;
    description: string;
    capacity: number;
    images: string[];
    amenities: string[];
    category: string;
    location: string;
    district: string;
    sessions: VenueSession[];
    averageRating: number | null;
    reviewCount: number;
    createdAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetVenuesResponse {
    venues: Venue[];
    pagination: Pagination;
}

export interface GetVenuesParams {
    district?: string;
    category?: string;
    page?: number;
    limit?: number;
}

export async function getVenuesApi(params: GetVenuesParams = {}): Promise<GetVenuesResponse> {
    const query = new URLSearchParams();
    if (params.district) query.set("district", params.district);
    if (params.category) query.set("category", params.category);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const res = await fetch(`${API_BASE}/owner/venues${qs ? `?${qs}` : ""}`);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Failed to fetch venues");
    }

    return res.json();
}

export async function createVenueApi(payload: CreateVenuePayload, token: string) {
    const res = await fetch(`${API_BASE}/owner/create-venue`, {
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
