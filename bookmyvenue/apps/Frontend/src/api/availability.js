import api from "./axios";

export async function getAvailability(venueId, date = null) {
    const response = await api.get(
        `/api/availability/${venueId}`, {
            params: date ? {
                date
            } : {},
        }
    );

    return response.data;
}

export async function createAvailability(data, token) {
    const response = await api.post(
        "/api/availability/",
        data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function deleteAvailability(id, token) {
    await api.delete(`/api/availability/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}