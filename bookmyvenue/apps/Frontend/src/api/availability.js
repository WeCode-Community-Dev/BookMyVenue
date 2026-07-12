import axios from "./axios";


// Owner creates availability
export async function createAvailability(data, token) {

    const response = await axios.post(
        "/api/availability/",
        data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}



// Public availability fetch
export async function getAvailability(
    venueId,
    date = null
) {

    const response = await axios.get(
        `/api/availability/${venueId}`, {
            params: date ? {
                date
            } : {}
        }
    );

    return response.data;
}