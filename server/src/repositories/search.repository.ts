import Venue from '@/models/venue.model';

export class SearchRepository {
  async searchVenues(query: string) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startsWithQuery = `^${escapedQuery}`;
    return Venue.find({
      $or: [
        { 'address.city': { $regex: startsWithQuery, $options: 'i' } },
        { 'address.district': { $regex: startsWithQuery, $options: 'i' } },
        { 'address.state': { $regex: startsWithQuery, $options: 'i' } },
        { 'address.street': { $regex: startsWithQuery, $options: 'i' } }
      ]
    })
      .limit(10)
      .select('_id name address');
  }

  async findNearestVenues(longitude: number, latitude: number, query?: string) {
    const filter: Record<string, any> = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 20000,
        },
      },
    };

    if (query) {
      filter.name = {
        $regex: query,
        $options: 'i',
      };
    }

    return Venue.find(filter)
      .limit(10)
      .select('_id name address');
  }
}
