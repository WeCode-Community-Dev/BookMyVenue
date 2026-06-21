import { axiosClient } from 'src/lib/axios';

import type { SavedVenue } from './types/venue.type';

interface Pagination<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export class UserFavoritesApiService {
    static async getSavedVenues(
        page: number = 1,
        limit: number = 12,
    ): Promise<Pagination<SavedVenue>> {
        const response = await axiosClient.get('/saved-venues', {
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
