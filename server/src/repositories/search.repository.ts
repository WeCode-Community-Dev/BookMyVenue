import Venue from '@/models/venue.model';

export class SearchRepository {
  async searchVenues(query: string) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startsWithQuery = `^${escapedQuery}`;
    return Venue.find({
      verificationStatus: 'approved',
      isActive: true,
      isDeleted: { $ne: true },
      isAvailabilityConfigured: true,
      $or: [
        { 'address.city': { $regex: startsWithQuery, $options: 'i' } },
        { 'address.district': { $regex: startsWithQuery, $options: 'i' } },
        { 'address.state': { $regex: startsWithQuery, $options: 'i' } },
        { 'address.street': { $regex: startsWithQuery, $options: 'i' } }
      ]
    })
      .limit(10)
      .select('_id name address images');
  }

  async findNearestVenues(longitude: number, latitude: number, query?: string, radius: number = 20000) {
    const filter: Record<string, any> = {
      verificationStatus: 'approved',
      isActive: true,
      isDeleted: { $ne: true },
      isAvailabilityConfigured: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        },
      },
    };

    if (query?.trim()) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const startsWithQuery = `^${escapedQuery}`;
      filter.$or = [
        { 'address.city': { $regex: startsWithQuery, $options: 'i' } },
        { 'address.district': { $regex: startsWithQuery, $options: 'i' } },
        { 'address.state': { $regex: startsWithQuery, $options: 'i' } },
        { 'address.street': { $regex: startsWithQuery, $options: 'i' } }
      ];
    }

    return Venue.find(filter)
      .limit(10)
      .select('_id name address images');
  }
}
