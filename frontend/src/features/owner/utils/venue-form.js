/**
 * Amenity keys accepted by POST/PUT /venues (matches backend AMENITY_FIELDS).
 */
export const VENUE_AMENITY_OPTIONS = [
  { name: 'parking', label: 'Parking' },
  { name: 'airConditioning', label: 'Air conditioning' },
  { name: 'petsAllowed', label: 'Pets allowed' },
  { name: 'outsideFoodAllowed', label: 'Outside food allowed' },
  { name: 'catering', label: 'Catering' },
  { name: 'cafeteria', label: 'Cafeteria' },
  { name: 'stage', label: 'Stage' },
  { name: 'swimmingPool', label: 'Swimming pool' },
  { name: 'wifi', label: 'Wi‑Fi' },
];

export const EMPTY_AMENITIES = {
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

export function amenitiesFromVenue(amenities) {
  if (!amenities) return { ...EMPTY_AMENITIES };

  return {
    ...EMPTY_AMENITIES,
    parking: Boolean(amenities.parking),
    parkingSize: amenities.parkingSize ?? null,
    airConditioning: Boolean(amenities.airConditioning),
    petsAllowed: Boolean(amenities.petsAllowed),
    outsideFoodAllowed: Boolean(amenities.outsideFoodAllowed),
    catering: Boolean(amenities.catering),
    cafeteria: Boolean(amenities.cafeteria),
    stage: Boolean(amenities.stage),
    swimmingPool: Boolean(amenities.swimmingPool),
    wifi: Boolean(amenities.wifi),
  };
}

/** Coerce Formik string inputs into the shape the API expects. */
export function toVenueApiPayload(values) {
  const parkingSize =
    values.amenities.parking && values.amenities.parkingSize !== '' && values.amenities.parkingSize != null
      ? Number(values.amenities.parkingSize)
      : null;

  return {
    name: values.name.trim(),
    description: values.description?.trim() || undefined,
    pricePerHour: Number(values.pricePerHour),
    city: values.city.trim(),
    district: values.district.trim(),
    state: values.state.trim(),
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    country: values.country.trim(),
    capacity: Number(values.capacity),
    amenities: {
      parking: Boolean(values.amenities.parking),
      parkingSize,
      airConditioning: Boolean(values.amenities.airConditioning),
      petsAllowed: Boolean(values.amenities.petsAllowed),
      outsideFoodAllowed: Boolean(values.amenities.outsideFoodAllowed),
      catering: Boolean(values.amenities.catering),
      cafeteria: Boolean(values.amenities.cafeteria),
      stage: Boolean(values.amenities.stage),
      swimmingPool: Boolean(values.amenities.swimmingPool),
      wifi: Boolean(values.amenities.wifi),
    },
  };
}
