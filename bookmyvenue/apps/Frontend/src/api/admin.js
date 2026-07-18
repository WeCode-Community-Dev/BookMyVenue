import axios from "./axios";

export async function getAdminStats(token) {
    const response = await axios.get("/api/admin/stats", {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
}

export async function getAdminUsers(token, role = null, page = 1, limit = 20) {
    const response = await axios.get("/api/admin/users", {
        params: {
            page,
            limit,
            ...(role ? {
                role
            } : {})
        },
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
}

export async function getAllVenuesAdmin(token, status = null, page = 1, limit = 20) {
    const response = await axios.get("/api/admin/venues", {
        params: {
            page,
            limit,
            ...(status ? {
                status
            } : {})
        },
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
}

export async function updateVenueStatus(id, status, token) {
    const response = await axios.put(`/api/admin/venues/${id}/status`, {
        status
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
}

export async function getAllBookingsAdmin(token, status = null, page = 1, limit = 20) {
    const response = await axios.get("/api/admin/bookings", {
        params: {
            page,
            limit,
            ...(status ? {
                status
            } : {})
        },
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
}

export async function updateCategoryStatus(id, is_active, token) {
    const response = await axios.put(`/api/admin/categories/${id}/status`, {
        is_active
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
}