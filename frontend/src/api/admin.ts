import { axiosClient } from "src/lib/axios";

import type { ListUserResponse } from "./types/user.typs";
import type { VenueListResponse } from "./types/venue.type";


export class AdminApiService {

    /**
     * Get list of users with pagination
     */
    static async listUsers(page: number = 1, limit: number = 10) {
        const response =
            await axiosClient.get(
                '/users',
                {
                    params: { page, limit },
                }
            );
        return response.data as ListUserResponse
    }

    /**
     * Get list of users with pagination
     */
    static async listVenues(page: number = 1, limit: number = 10) {
        const response =
            await axiosClient.get(
                '/admin/venues',
                {
                    params: { page, limit },
                }
            );
        return response.data as VenueListResponse
    }

    /**
     * Approve Venue
     */
    static async approveVenue(venueId: string) {
        const response = await axiosClient.post(`/admin/venues/${venueId}/approve`);
        return response.data as VenueListResponse
    }

    /**
     * Reject Venue
     */
    static async rejectVenue(venueId: string) {
        const response = await axiosClient.post(`/admin/venues/${venueId}/reject`);
        return response.data as VenueListResponse
    }
}