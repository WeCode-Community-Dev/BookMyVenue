import { apiClient } from '@/services/apiClient';
import type {
  RevenueChartProps,
  RevenueDistributionProps,
  StatCardProps,
  TopPerformingVenuesProps,
  UpcomingBookingProps,
  VenueHealthProps,
} from '../types/ownerDashbord.types';

export interface OwnerDashboardData {
  revenueChartData: RevenueChartProps;
  pieChartData: RevenueDistributionProps;
  statCardData: StatCardProps;
  upcomingData: UpcomingBookingProps;
  venueHealthData: VenueHealthProps;
  topPerformingData: TopPerformingVenuesProps;
}

export async function getDashboardData(): Promise<OwnerDashboardData> {
  const res = await apiClient.get('/owners/dashboard');
  const serverData = res.data.data;
  return {
    statCardData: { data: serverData.statCardData || [] },
    revenueChartData: { data: serverData.revenueChartData || [] },
    pieChartData: { data: serverData.revenueDistributionData || [] },
    upcomingData: { data: serverData.upcomingBookings || [] },
    venueHealthData: {
      data: serverData.venueHealthData || {
        totalVenues: 0,
        activeVenues: 0,
        pendingVenues: 0,
        rejectedVenues: 0,
      },
    },
    topPerformingData: { data: serverData.topPerformingData || [] },
  };
}
