export type UserRole = "user" | "owner" | "admin";

export type VenueType =
  | "birthday_hall"
  | "cafe"
  | "hotel"
  | "resort"
  | "auditorium"
  | "meetup"
  | "mall"
  | "other";

export type VenueStatus = "pending" | "approved" | "rejected";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "cancelled"
  | "completed";

export type PaymentStatus = "mock_success" | "mock_refunded" | "failed";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  google_sub?: string | null;
}

export interface Venue {
  id: number;
  owner_id: number;
  name: string;
  type: VenueType;
  description?: string | null;
  address: string;
  lat?: number | null;
  lng?: number | null;
  price_per_hour: number;
  capacity: number;
  photos: string[];
  amenities: string[];
  status: VenueStatus;
  created_at: string;
  distance_km?: number | null;
}

export interface Booking {
  id: number;
  user_id: number;
  venue_id: number;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  total_price: number;
  created_at: string;
  venue_name?: string | null;
}

export interface OverviewStats {
  total_users: number;
  total_venues: number;
  pending_venues: number;
  total_bookings: number;
  total_revenue: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const VENUE_TYPES: { value: VenueType; label: string }[] = [
  { value: "birthday_hall", label: "Birthday Hall" },
  { value: "cafe", label: "Cafe" },
  { value: "hotel", label: "Hotel" },
  { value: "resort", label: "Resort" },
  { value: "auditorium", label: "Auditorium" },
  { value: "meetup", label: "Meetup Space" },
  { value: "mall", label: "Mall" },
  { value: "other", label: "Other" },
];

export function venueTypeLabel(t: VenueType): string {
  return VENUE_TYPES.find((v) => v.value === t)?.label ?? t;
}
