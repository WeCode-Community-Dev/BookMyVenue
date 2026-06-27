import { apiClient } from "@/lib/axios-client";

export interface VenueRevenue {
  venueId: string;
  venueName: string;
  ownerName?: string;
  bookings: number;
  revenue: number;
  commission: number;
}

export interface RevenueSummary {
  commissionRate: number;
  totalRevenue: number;
  totalBookings: number;
  platformCommission: number;
  ownerPayout: number;
  venues: VenueRevenue[];
}

export const getRevenueSummary = async (): Promise<RevenueSummary> => {
  const { data } = await apiClient.get("/analytics/revenue");
  return data.summary;
};
