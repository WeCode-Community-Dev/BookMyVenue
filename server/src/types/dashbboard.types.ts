export interface ApiResponse<T> {
  data: T;
}

export interface RevenueChartItem {
  period: string;
  revenue: number;
  bookings: number;
}

export interface RevenueDistributionItem {
  category: string;
  revenue: number;
}

export interface StatCardItem {
  title: string;
  value: string | number;
}

export interface UpcomingBooking {
  id: string;
  venueName: string;
  customer: string;
  guests: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface TopVenueItem {
  id: string;
  name: string;
  revenue: number;
  bookings: number;
  occupancyRate: number;
}

export interface VenueHealthItem {
  totalVenues: number;
  activeVenues: number;
  pendingVenues: number;
  rejectedVenues: number;
}

export interface OwnerDashboard {
  revenueChartData: RevenueChartItem[];
  revenueDistributionData: RevenueDistributionItem[];
  statCardData: StatCardItem[];
  upcomingBookings: UpcomingBooking[];
  venueHealthData: VenueHealthItem;
  topPerformingData: TopVenueItem[];
}
