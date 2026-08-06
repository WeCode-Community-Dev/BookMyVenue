import {api} from '../api/client.js';

export const getVenueCategories = async () => {
    const response = await api.get("/venueCategories");
    return response.data;
}