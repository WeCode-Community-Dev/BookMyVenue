function toNumber(value) {
  return value != null ? Number(value) : null;
}

function mapAmenities(amenities) {
  if (!amenities) return null;

  return {
    id: amenities.id,
    parking: amenities.parking,
    parkingSize: amenities.parkingSize,
    airConditioning: amenities.airConditioning,
    petsAllowed: amenities.petsAllowed,
    outsideFoodAllowed: amenities.outsideFoodAllowed,
    catering: amenities.catering,
    cafeteria: amenities.cafeteria,
    stage: amenities.stage,
    swimmingPool: amenities.swimmingPool,
    wifi: amenities.wifi,
  };
}

export function toPublicVenue(venue) {
  return {
    id: venue.id,
    ownerId: venue.ownerId,
    name: venue.name,
    description: venue.description,
    pricePerHour: toNumber(venue.pricePerHour),
    city: venue.city,
    district: venue.district,
    state: venue.state,
    latitude: toNumber(venue.latitude),
    longitude: toNumber(venue.longitude),
    country: venue.country,
    capacity: venue.capacity,
    createdAt: venue.createdAt,
    amenities: mapAmenities(venue.amenities),
  };
}
