export interface RevenuePoint {
  period: string;
  revenue: number;
  commission: number;
}

export interface BookingPoint {
  period: string;
  bookings: number;
  confirmed: number;
  cancelled: number;
}

export interface CategoryPerformance {
  category: string;
  revenue: number;
}

export interface Activity {
  title: string;
  description: string;
  time: string;
  type?: string;
  colorClass?: string;
}

export interface PlatformLeaderItem {
  rank: number;
  title: string;
  name: string;
  metric: string;
}

export type PlatformLeaders = PlatformLeaderItem[];

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'urgent' | string;
  time: string;
  pulse?: boolean;
  badgeText?: string;
}

export interface AdminDashboardData {
  stats: {
    totalUsers: number;
    totalVenues: number;
    totalBookings: number;
    totalRevenue: number;
  };

  pendingActions: {
    ownerVerifications: number;
    venueApprovals: number;
    venueUpdates: number;
    reportedVenues: number;
    refundRequests: number;
  };

  revenueChart: RevenuePoint[];

  bookingChart: BookingPoint[];

  categoryPerformance: CategoryPerformance[];

  recentActivity: Activity[];

  platformLeaders: PlatformLeaders;

  alerts: AlertItem[];
}
