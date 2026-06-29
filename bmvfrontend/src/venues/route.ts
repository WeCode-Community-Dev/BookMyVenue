import { apiFetch } from "@/src/lib/api";
import { PublicVenuesFilterDto, PublicVenuesResponse, PublicVenueDetailResponseDto } from "./types";

/**
 * Fetch approved venues from /venues/public with query parameter filtering and pagination.
 */
export const fetchPublicVenues = (filters: PublicVenuesFilterDto = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.city) {
    queryParams.append("city", filters.city);
  }
  if (filters.venueType) {
    queryParams.append("venueType", filters.venueType);
  }
  if (filters.maxCapacity !== undefined) {
    queryParams.append("maxCapacity", filters.maxCapacity.toString());
  }
  if (filters.search) {
    queryParams.append("search", filters.search);
  }
  if (filters.page !== undefined) {
    queryParams.append("page", filters.page.toString());
  }
  if (filters.limit !== undefined) {
    queryParams.append("limit", filters.limit.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/venues/public${queryString ? `?${queryString}` : ""}`;

  return apiFetch<PublicVenuesResponse>(endpoint);
};

/**
 * Fetch details of a specific approved venue.
 */
export const fetchPublicVenueDetail = (id: string) => {
  return apiFetch<PublicVenueDetailResponseDto>(`/venues/public/${id}`);
};
