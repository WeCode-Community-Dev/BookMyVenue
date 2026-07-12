import api from "./axios";

export async function getAvailability(venueId, date = null) {
    const params = {};

    if (date) {
        params.date = date;
    }

    const response = await api.get(`/api/availability/${venueId}`, {
        params,
    });

    return response.data;
}