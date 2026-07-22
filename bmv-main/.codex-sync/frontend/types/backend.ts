export type BackendRole = "USER" | "VENUE_OWNER" | "ADMIN";

export type BackendVenueStatus =
  | "PENDING_DOCUMENTS"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type BackendVenueCategory =
  | "WEDDING"
  | "BIRTHDAY"
  | "CONFERENCE"
  | "SPORTS"
  | "PARTY"
  | "AUDITORIUM"
  | "RESORT"
  | "MEETING"
  | "OTHER";

export type BackendVenueAmenity =
  | "WIFI"
  | "PARKING"
  | "AIR_CONDITIONING"
  | "CATERING"
  | "RESTROOM"
  | "SOUND_SYSTEM"
  | "PROJECTOR"
  | "STAGE"
  | "GENERATOR"
  | "OTHER";

export interface BackendVenueImage {
  imageUrl: string;
}

export interface BackendVenueOwnerProfile {
  name: string | null;
  profilePicture?: string | null;
  biography?: string | null;
}

export interface BackendVenueOwner {
  email: string;
  profile?: BackendVenueOwnerProfile | null;
}

export interface BackendVenue {
  id: string;
  name: string;
  description?: string | null;
  city: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  capacity?: number | null;
  price?: number | null;
  categories?: BackendVenueCategory[];
  amenities?: BackendVenueAmenity[];
  status: BackendVenueStatus;
  rejectionReason?: string | null;
  bookingApprovalRequired?: boolean;
  createdAt?: string;
  images?: BackendVenueImage[];
  owner?: BackendVenueOwner;
}

export interface BackendVenueSearchResponse {
  data: BackendVenue[];
  pagination: {
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
  };
}

export interface BackendProfile {
  name: string;
  email: string;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  biography?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

export interface BackendBookingVenue {
  id: string;
  name: string;
  city: string;
  images?: BackendVenueImage[];
}

export interface BackendPayment {
  amount: number;
  status: string;
}

export interface BackendBooking {
  id: string;
  venueId: string;
  venue: BackendBookingVenue;
  eventStart: string;
  eventEnd: string;
  guestCount: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  payment?: BackendPayment | null;
}
