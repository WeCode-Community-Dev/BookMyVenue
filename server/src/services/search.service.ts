import { SearchRepository } from '@/repositories/search.repository';
import { SearchSuggestionDTO } from '@/dto/search/search.dto';

export class SearchService {
  constructor(private searchRepository: SearchRepository) {}

  async getSuggestions(
    type: string,
    query: string,
    latitude?: number,
    longitude?: number
  ): Promise<SearchSuggestionDTO[]> {
    if (!query?.trim() && (latitude === undefined || longitude === undefined)) {
      return [];
    }

    switch (type) {
      case 'venue': {
        let venues;
        if (latitude !== undefined && longitude !== undefined) {
          venues = await this.searchRepository.findNearestVenues(longitude, latitude, query?.trim());
        } else {
          venues = await this.searchRepository.searchVenues(query);
        }
        return venues.map((v) => ({
          id: v._id.toString(),
          label: v.name,
          subtitle: v.address ? `${v.address.city}, ${v.address.state}` : '',
          type: 'venue',
        }));
      }
      default:
        return [];
    }
  }
}
