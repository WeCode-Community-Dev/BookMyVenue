import { axiosClient } from 'src/lib/axios';

import type {
    VenueCard,
    VenueReview,
    VenueDetails,
    VenueListResponse,
    VenueSearchFilters,
    VenueAvailabilityRange,
} from './types/venue.type';

interface Pagination<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export class VenuePublicApiService {
    static async searchVenues(filters: VenueSearchFilters): Promise<VenueListResponse> {
        const response = await axiosClient.get('/venues', { params: filters });
        return response.data;
    }

    static async getFeaturedVenues(): Promise<VenueCard[]> {
        const response = await axiosClient.get('/venues/featured');
        return response.data;
    }

    static async getVenueDetails(id: string): Promise<VenueDetails> {
        const response = await axiosClient.get(`/venues/${id}`);
        return response.data?.data ?? response.data;
    }

    static async getVenueAvailability(
        id: string,
        startDate: string,
        endDate: string,
    ): Promise<VenueAvailabilityRange> {
        const response = await axiosClient.get(`/venues/${id}/availability`, {
            params: { startDate, endDate },
        });
        return response.data;
    }

    static async getVenueReviews(
        id: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<Pagination<VenueReview>> {
        const response = await axiosClient.get(`/venues/${id}/reviews`, {
            params: { page, limit },
        });
        return response.data;
    }

    static async saveVenue(venueId: string): Promise<void> {
        await axiosClient.post(`/saved-venues/${venueId}`);
    }

    static async unsaveVenue(venueId: string): Promise<void> {
        await axiosClient.delete(`/saved-venues/${venueId}`);
    }
}
