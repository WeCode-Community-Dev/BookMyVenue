import Venue from '@/models/venue.model';
import Category from '@/models/category.model';
import { DistrictDto, VenueCardDto } from '@/dto/venue/venue-card.dto';
import { CategoryDocument } from '@/types/category.types';

export interface HomeDataDto {
  venues: VenueCardDto[];
  categories: CategoryDocument[];
  districts: DistrictDto[];
}

const getHomeData = async (): Promise<HomeDataDto> => {
  const [venues, categories] = await Promise.all([
    Venue.find({
      isActive: true,
      verificationStatus: 'approved',
    })
      .select(
        'name images address.city address.district capacity pricing isElite isFeatured location'
      )
      .lean<VenueCardDto[]>(),
    Category.find({
      isActive: true,
    }).lean<CategoryDocument[]>(),
  ]);

  const districtMap = new Map<string, DistrictDto>();

  for (const venue of venues) {
    const district = venue.address?.district;

    if (!district) continue;

    const [lng, lat] = venue.location.coordinates;

    if (!districtMap.has(district)) {
      districtMap.set(district, {
        id: district.toLowerCase(),
        name: district,
        coordinates: [lng, lat],
        venueCount: 0,
        featuredVenues: [],
      });
    }

    const item = districtMap.get(district)!;

    item.venueCount++;

    if (item.featuredVenues.length < 5) {
      item.featuredVenues.push(venue);
    }
  }

  const districts = [...districtMap.values()];

  return {
    venues,
    categories,
    districts,
  };
};

export default {
  getHomeData,
};
