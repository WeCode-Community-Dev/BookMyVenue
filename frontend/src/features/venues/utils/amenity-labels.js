const AMENITY_LABELS = {
  parking: 'Parking',
  airConditioning: 'Air conditioning',
  petsAllowed: 'Pets allowed',
  outsideFoodAllowed: 'Outside food allowed',
  catering: 'Catering',
  cafeteria: 'Cafeteria',
  stage: 'Stage',
  swimmingPool: 'Swimming pool',
  wifi: 'Wi‑Fi',
};

export function getActiveAmenities(amenities) {
  if (!amenities) return [];

  return Object.entries(AMENITY_LABELS)
    .filter(([key]) => amenities[key])
    .map(([, label]) => label);
}
