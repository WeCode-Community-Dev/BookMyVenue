/**
 * All venue types supported on BookMyVenue.
 * Normalized to UPPER_SNAKE_CASE matching NestJS backend.
 */
export enum VenueType {
  WEDDING_HALL = 'WEDDING_HALL',
  AUDITORIUM = 'AUDITORIUM',
  RESORT = 'RESORT',
  CONVENTION_CENTER = 'CONVENTION_CENTER',
  CAFE = 'CAFE',
  PARTY_HALL = 'PARTY_HALL',
  MEETUP_SPACE = 'MEETUP_SPACE',
  MALL = 'MALL',
  HOTEL = 'HOTEL',
}

/**
 * Public Venue summary information returned by GET /venues/public
 */
export interface PublicVenueResponseDto {
  id: string;
  venueName: string;
  city: string;
  venueType: VenueType;
  maxCapacity: number;
  startingPrice: number;
  thumbnailImage: string | null;
}

/**
 * Filter and query DTO parameters for GET /venues/public
 */
export interface PublicVenuesFilterDto {
  city?: string;
  venueType?: VenueType;
  maxCapacity?: number;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Paginated envelope schema
 */
export interface PublicVenuesResponse {
  data: PublicVenueResponseDto[];
  total: number;
  page: number;
  limit: number;
}

/**
 * How the venue accepts bookings.
 */
export enum BookingType {
  FULL_DAY = 'FULL_DAY',
  TIME_SLOT = 'TIME_SLOT',
}

/**
 * Image sub-resource schema
 */
export interface VenueImage {
  id: string;
  imageUrl: string;
  displayOrder: number;
}

/**
 * Public Venue full detailed information returned by GET /venues/public/:id
 */
export interface PublicVenueDetailResponseDto {
  id: string;
  venueName: string;
  venueType: VenueType;
  description: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  maxCapacity: number;
  squareFeet: number;
  hasParking: boolean;
  parkingCapacity: number | null;
  startingPrice: number;
  bookingType: BookingType;
  images: VenueImage[];
}
