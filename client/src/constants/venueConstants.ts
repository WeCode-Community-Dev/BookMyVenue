export const VENUE_TYPES = [
  'Hall',
  'Turf',
  'Swimming Pool',
  'Open Ground',
  'Auditorium',
  'Convention Center',
  'Resort',
  'Party Hall',
  'Conference Space',
  'Other',
] as const;

export const SPACE_ATTRIBUTES = [
  'Indoor',
  'Outdoor (Garden/Lawn)',
  'Rooftop',
  'Poolside',
  'Both Indoor & Outdoor',
] as const;

export const SEATING_CONFIGURATIONS = [
  'Floating',
  'Theatre Seating',
  'Round Table',
  'Banquet Seating',
  'Standing',
] as const;

export const AMENITIES_LIST = [
  'Parking',
  'AC',
  'Dining Area',
  'Wifi',
  'Generator',
  'Sound System',
  'Stage',
  'Rooms',
  'Lift',
  'Wheelchair Access',
  'Decoration Space',
  'Catering Area',
] as const;

export const BOOKING_TYPES = {
  FIXED: 'fixedBooking',
  FLEXIBLE: 'flexibleBooking',
} as const;

export const PRICING_TYPES = {
  FIXED: 'fixedPricing',
  TIME_BASED: 'timeBasedPricing',
} as const;
