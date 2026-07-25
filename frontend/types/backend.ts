
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

export type BackendVenueDocumentType = "GOVERNMENT_ID" | "PROPERTY_DOCUMENT";
export type BackendBlockType = "FULL_DAY" | "TIME_SLOT";

export interface BackendVenueImage {
  imageUrl: string;
}

export interface BackendVenueDocument {
  type: BackendVenueDocumentType;
  documentUrl: string;
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
  documents?: BackendVenueDocument[];
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

export interface BackendVenueBlockedSlot {
  id: string;
  blockType: BackendBlockType;
  startDate: string;
  endDate: string;
  reason?: string | null;
}

export interface BackendReservedBooking {
  id: string;
  eventStart: string;
  eventEnd: string;
  status: string;
}

export interface BackendVenueAvailability {
  venueId: string;
  bookingApprovalRequired: boolean;
  unavailableDates: string[];
  blockedSlots: BackendVenueBlockedSlot[];
  reservedBookings: BackendReservedBooking[];
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

export interface BackendBookingRequester {
  email: string;
  profile?: BackendVenueOwnerProfile | null;
}

export interface BackendBooking {
  id: string;
  venueId: string;
  venue: BackendBookingVenue;
  user?: BackendBookingRequester;
  eventStart: string;
  eventEnd: string;
  eventName?: string;
  guestCount: number;
  specialRequests?: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  payment?: BackendPayment | null;
}
