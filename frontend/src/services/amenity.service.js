import { api } from '../api/client.js';

export const getAmenities = async () => {
    const response = await api.get("/amenities");
    return response.data;
}
