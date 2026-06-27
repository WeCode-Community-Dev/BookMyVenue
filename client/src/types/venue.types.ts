export const VENUE_TYPES = [
  "BANQUET_HALL",
  "CONFERENCE_ROOM",
  "WEDDING_LAWN",
  "AUDITORIUM",
  "ROOFTOP",
  "PARTY_HALL",
] as const;

export type VenueType = (typeof VENUE_TYPES)[number];

export const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  BANQUET_HALL: "Banquet Hall",
  CONFERENCE_ROOM: "Conference Room",
  WEDDING_LAWN: "Wedding Lawn",
  AUDITORIUM: "Auditorium",
  ROOFTOP: "Rooftop",
  PARTY_HALL: "Party Hall",
};

export interface VenueOwner {
  _id: string;
  name: string;
  email: string;
}

export interface Venue {
  _id: string;
  owner: string;
  name: string;
  description?: string;
  venueType: VenueType;
  address?: string;
  city?: string;
  capacity?: number;
  pricePerHour: number;
  openingTime: number;
  closingTime: number;
  images: string[];
  amenities: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminVenue extends Omit<Venue, "owner"> {
  owner: VenueOwner;
}
