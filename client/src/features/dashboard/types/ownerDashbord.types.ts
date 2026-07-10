import type React from 'react';

export type RevenueChartItem = {
  period: string;
  revenue: number;
  bookings: number;
};

export type RevenueDistributionItem = {
  category: string;
  revenue: number;
};

export type StatCardProps = {
  data:
    | [
        {
          title: string;
          value: string | number;
          icon?: React.ReactNode;
        },
      ]
    | [];
};

export type UpcomingBookingItem = {
  id: string;
  venueName: string;
  customer: string;
  guests: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
};

export type VenueHealthItem = {
  totalVenues: number;
  activeVenues: number;
  pendingVenues: number;
  rejectedVenues: number;
};

export type TopVenueItem = {
  id: string;
  name: string;
  revenue: number;
  bookings: number;
  occupancyRate: number;
};

export type TopPerformingVenuesProps = {
  data: TopVenueItem[];
};

export type RevenueChartProps = {
  data: RevenueChartItem[];
};

export type RevenueDistributionProps = {
  data: RevenueDistributionItem[];
};

// export type StatCardProps = {
//   data: StatCardItem[];
// };

export type UpcomingBookingProps = {
  data: UpcomingBookingItem[];
};

export type VenueHealthProps = {
  data: VenueHealthItem;
};

export type FilterType = 'weekly' | 'monthly' | 'yearly';

export type RevenueTitleProps = {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};
