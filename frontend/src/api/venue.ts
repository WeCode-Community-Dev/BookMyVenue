import { axiosClient } from "src/lib/axios";

import type { VenueListResponse } from "./types/venue.type";



export class VenueApiService {

    /**
     * Get list of users with pagination
     */
    static async listVenues(page: number = 1, limit: number = 10) {
        const response =
            await axiosClient.get(
                '/venues',
                {
                    params: { page, limit },
                }
            );
        return response.data as VenueListResponse
    }
}