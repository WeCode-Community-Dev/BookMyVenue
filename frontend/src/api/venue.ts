import { axiosClient } from "src/lib/axios";

import type { VenueCard } from "./types/venue.type";
import type { Pagination, PaginationFilter } from "./types/common";

export interface CreateVenueResponse {
    venueId: string;
}

export interface UploadVenueImagesResponse {
    message: string;
}

export class VenueApiService {

    /**
     * Get list of venues owned by the current user
     */
    static async listMyVenues({ limit, page, search }: PaginationFilter) {
        const response = await axiosClient.get('/venues/my-venues', {
            params: {
                offset: page * limit,
                limit,
                search
            }
        });
        return response.data as Pagination<VenueCard>
    }

    static async createVenue(data: Record<string, unknown>) {
        const response = await axiosClient.post('/venues', data);
        return response.data as CreateVenueResponse;
    }

    static async uploadVenueImages(venueId: string, files: File[]) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));

        const response = await axiosClient.post<UploadVenueImagesResponse>(
            `/venues/${venueId}/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return response.data;
    }

}