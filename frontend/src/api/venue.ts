import { axiosClient } from "src/lib/axios";

import type { VenueCard } from "./types/venue.type";


export class VenueApiService {

    /**
     * Get list of users with pagination
     */
    static async listMyVenues() {
        const response = await axiosClient.get('/venues/my-venues');
        return response.data as VenueCard[]
    }
}