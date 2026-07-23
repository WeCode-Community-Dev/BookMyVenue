import { apiFetch } from "@/lib/api";

export type VenueCategory =
  | "Conference"
  | "Wedding"
  | "Party"
  | "Outdoor"
  | "Workshop"
  | "Exhibition"
  | "Sports";

export interface Venue {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  category: VenueCategory | "";
  capacity: number;
  price_per_hour: number;
  images: string[];
  amenities: string[];
  highlights: string[];
  created_at: string;
}

export interface CreateVenueInput {
  name: string;
  description?: string;
  location: string;
  city?: string;
  category?: string;
  capacity: number;
  price_per_hour: number;
  images?: string[];
  amenities?: string[];
  highlights?: string[];
}

export interface VenueQuery {
  search?: string;
  category?: VenueCategory | "All";
  city?: string;
}

export async function fetchVenues(query?: VenueQuery): Promise<Venue[]> {
  const params = new URLSearchParams();
  if (query?.search) params.set("search", query.search);
  if (query?.category && query.category !== "All") params.set("category", query.category);
  if (query?.city) params.set("city", query.city);
  const qs = params.toString();
  return apiFetch<Venue[]>(`/venues${qs ? `?${qs}` : ""}`);
}

export async function fetchVenueById(id: string): Promise<Venue> {
  return apiFetch<Venue>(`/venues/${id}`);
}

export async function createVenue(data: CreateVenueInput): Promise<Venue> {
  return apiFetch<Venue>("/venues", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateVenue(id: string, data: CreateVenueInput): Promise<void> {
  return apiFetch<void>(`/venues/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteVenue(id: string): Promise<void> {
  return apiFetch<void>(`/venues/${id}`, {
    method: "DELETE",
  });
}

export async function fetchMyVenues(): Promise<Venue[]> {
  return apiFetch<Venue[]>("/venues/mine");
}

export const VENUE_CATEGORIES: VenueCategory[] = [
  "Conference",
  "Wedding",
  "Party",
  "Outdoor",
  "Workshop",
  "Exhibition",
  "Sports",
];
