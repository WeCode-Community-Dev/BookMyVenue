import { apiClient } from '@/services/apiClient';
import type { SearchSuggestion } from "../components/ui/Search/types";

export const searchService = {
    async getVenueSuggestions(
        query: string,
        latitude?: number,
        longitude?: number
    ): Promise<SearchSuggestion[]> {
        try {
            const response = await apiClient.get('/users/search', {
                params: {
                    type: 'venue',
                    q: query,
                    latitude,
                    longitude
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch suggestions', error);
            return [];
        }
    }
}