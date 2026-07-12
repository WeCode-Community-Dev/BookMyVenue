import api from "./axios";

export async function createBooking(data, token) {
    const response = await api.post("/api/bookings", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}


export async function getMyBookings(token) {
    const response = await api.get("/api/bookings/my", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}


export async function getOwnerBookings(token) {
    const response = await api.get("/api/bookings/owner", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}


export async function updateBookingStatus(id, status, token) {
    const response = await api.put(
        `/api/bookings/${id}/status`, {
            status: status,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}