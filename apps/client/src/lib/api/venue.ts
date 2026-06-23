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
