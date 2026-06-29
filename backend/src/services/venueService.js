import { ApiError } from '../utils/ApiError.js';
import { toPublicVenue } from '../utils/venueMapper.js';
import { venueRepository } from '../repositories/venueRepository.js';

const VENUE_FIELDS = [
  'name',
  'description',
  'pricePerHour',
  'city',
  'district',
  'state',
  'latitude',
  'longitude',
  'country',
  'capacity',
];

const AMENITY_FIELDS = [
  'parking',
  'parkingSize',
  'airConditioning',
  'petsAllowed',
  'outsideFoodAllowed',
  'catering',
  'cafeteria',
  'stage',
  'swimmingPool',
  'wifi',
];

const DEFAULT_AMENITIES = {
  parking: false,
  parkingSize: null,
  airConditioning: false,
  petsAllowed: false,
  outsideFoodAllowed: false,
  catering: false,
  cafeteria: false,
  stage: false,
  swimmingPool: false,
  wifi: false,
};

function pickFields(source, fields) {
  const result = {};

  for (const field of fields) {
    if (source[field] !== undefined) {
      result[field] = source[field];
    }
  }

  return result;
}

//check if the venue is owned by the user
function assertOwner(venue, ownerId) {
  if (venue.ownerId !== ownerId) {
    throw new ApiError(403, 'You do not own this venue', 'FORBIDDEN');
  }
}

export const venueService = {
  async listVenues(city) {
    const venues = await venueRepository.findAll({ city });
    return venues.map(toPublicVenue);
  },

  async getVenueById(id) {
    const venue = await venueRepository.findById(id);

    if (!venue) {
      throw new ApiError(404, 'Venue not found', 'VENUE_NOT_FOUND');
    }

    return toPublicVenue(venue);
  },

  async createVenue(ownerId, body) {
    const { amenities: amenitiesInput, ...rest } = body;
    const venueData = pickFields(rest, VENUE_FIELDS);
    const amenitiesData = {
      ...DEFAULT_AMENITIES,
      ...pickFields(amenitiesInput ?? {}, AMENITY_FIELDS),
    };

    const venue = await venueRepository.create(ownerId, venueData, amenitiesData);
    return toPublicVenue(venue);
  },

  async updateVenue(id, ownerId, body) {
    const existing = await venueRepository.findById(id);

    if (!existing) {
      throw new ApiError(404, 'Venue not found', 'VENUE_NOT_FOUND');
    }

    assertOwner(existing, ownerId);

    const { amenities: amenitiesInput, ...rest } = body;
    const venueData = pickFields(rest, VENUE_FIELDS);
    const amenitiesData = amenitiesInput
      ? pickFields(amenitiesInput, AMENITY_FIELDS)
      : {};

    const venue = await venueRepository.update(id, venueData, amenitiesData);
    return toPublicVenue(venue);
  },

  async deleteVenue(id, ownerId) {
    const existing = await venueRepository.findById(id);

    if (!existing) {
      throw new ApiError(404, 'Venue not found', 'VENUE_NOT_FOUND');
    }

    //check if the venue is owned by the user
    //if not checked user a can delete post of user b
    assertOwner(existing, ownerId);

    await venueRepository.delete(id);
  },
};
