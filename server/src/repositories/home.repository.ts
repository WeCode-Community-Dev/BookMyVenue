import Venue from '@/models/venue.model';
import Category from '@/models/category.model';
import Booking from '@/models/booking.model';
import { BookingStatus } from '@/constants/booking';
import { DistrictDto, VenueCardDto } from '@/dto/venue/venue-card.dto';
import { CategoryDocument } from '@/types/category.types';

export interface HomeDataDto {
  venues: VenueCardDto[];
  popularVenues: VenueCardDto[];
  eliteVenues: VenueCardDto[];
  categories: CategoryDocument[];
  districts: DistrictDto[];
}

const getHomeData = async (): Promise<HomeDataDto> => {
  const [venues, categories, bookingCounts] = await Promise.all([
    Venue.find({
      isActive: true,
      verificationStatus: 'approved',
    })
      .select(
        'name description images address.city address.district address.state capacity pricing isElite isFeatured location'
      )
      .populate('availability')
      .lean<VenueCardDto[]>(),
    Category.find({
      isActive: true,
    }).lean<CategoryDocument[]>(),
    Booking.aggregate([
      {
        $match: {
          bookingStatus: {
            $in: [BookingStatus.RESERVED, BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
          },
        },
      },
      {
        $group: {
          _id: '$venue',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const bookingCountMap = new Map<string, number>();
  for (const item of bookingCounts) {
    if (item._id) {
      bookingCountMap.set(item._id.toString(), item.count);
    }
  }

  // Attach booking count to each venue
  const venuesWithBookingCount = venues.map((venue) => ({
    ...venue,
    bookingCount: bookingCountMap.get(venue._id.toString()) || 0,
  }));

  // Sort venues by booking count (descending)
  venuesWithBookingCount.sort((a, b) => b.bookingCount - a.bookingCount);

  const districtMap = new Map<string, DistrictDto>();

  for (const venue of venuesWithBookingCount) {
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

  // Return top 8 venues as popularVenues
  const popularVenues = venuesWithBookingCount.slice(0, 8);

  // Return top 3 largest capacity venues as eliteVenues
  const eliteVenues = [...venuesWithBookingCount]
    .sort((a, b) => b.capacity - a.capacity)
    .slice(0, 3);

  return {
    venues: venuesWithBookingCount,
    popularVenues,
    eliteVenues,
    categories,
    districts,
  };
};

export default {
  getHomeData,
};
