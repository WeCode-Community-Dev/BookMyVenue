import api from "./axios";

export async function createVenue(data, token) {
    const response = await api.post("/api/venues/", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export async function getAllVenues() {
    const response = await api.get("/api/venues");

    return response.data;
}

export async function getVenueById(id) {
    const response = await api.get(`/api/venues/${id}`);

    return response.data;
}

export async function getMyVenues(token) {
    const response = await api.get("/api/venues/owner/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export async function updateVenue(id, data, token) {
    const response = await api.put(`/api/venues/update/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}