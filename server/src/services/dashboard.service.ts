import {
  getApprovedVenues,
  getOwnerVenues,
  getOwnerSettledRevenue,
  getOwnerCompletedBookingsCount,
  getOwnerChartData,
  getOwnerCategoryPerformance,
  getOwnerUpcomingBookings,
  getOwnerTopVenues,
  getVenueBookingsInLast30Days,
  getAdminStats,
  getAdminPendingActions,
  getAdminRevenueChart,
  getAdminBookingChart,
  getAdminCategoryPerformance,
  getAdminPlatformLeaders,
  getAdminAlerts,
} from '@/repositories/dashboard.repository';
import type { OwnerDashboard } from '@/types/dashbboard.types';
import Category from '@/models/category.model';

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// OWNER DASHBOARD SERVICE
export async function ownerDashboardService(ownerId: string): Promise<OwnerDashboard> {
  const approvedVenues = await getApprovedVenues(ownerId);
  const venueDocs = await getOwnerVenues(ownerId);
  const venueIds = venueDocs.map(v => v._id);

  if (venueIds.length === 0) {
    return {
      statCardData: [
        { title: 'Total Revenue', value: '₹0' },
        { title: 'Total Bookings', value: 0 },
        { title: 'Active Venues', value: approvedVenues },
        { title: 'Avg Rating', value: '0.0' },
      ],
      revenueChartData: {
        weekly: [],
        monthly: [],
        yearly: [],
      },
      revenueDistributionData: [],
      upcomingBookings: [],
      venueHealthData: {
        totalVenues: 0,
        activeVenues: approvedVenues,
        pendingVenues: 0,
        rejectedVenues: 0,
      },
      topPerformingData: [],
    };
  }

  // 1. Venue Health Data
  const totalVenues = venueDocs.length;
  let activeVenues = 0;
  let pendingVenues = 0;
  let rejectedVenues = 0;

  venueDocs.forEach(v => {
    if (v.isActive && v.verificationStatus === 'approved') {
      activeVenues++;
    }
    if (v.verificationStatus === 'pending') {
      pendingVenues++;
    }
    if (v.verificationStatus === 'rejected') {
      rejectedVenues++;
    }
  });

  const venueHealthData = {
    totalVenues,
    activeVenues,
    pendingVenues,
    rejectedVenues,
  };

  // 2. Total Revenue & Bookings Aggregation
  const totalRevenue = await getOwnerSettledRevenue(ownerId);
  const totalBookings = await getOwnerCompletedBookingsCount(venueIds);

  const statCardData: any[] = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}` },
    { title: 'Total Bookings', value: totalBookings },
    { title: 'Active Venues', value: approvedVenues },
    { title: 'Avg Rating', value: '0.0' },
  ];

  // 3. Weekly, Monthly, & Yearly Revenue & Bookings Chart Data
  const chartDataRaw = await getOwnerChartData(ownerId, venueIds);

  // Weekly mapping (Mon - Sun)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyChartData = weekDays.map((dayName, index) => {
    const revItem = chartDataRaw.weekly.settlementsAgg.find((item: any) => item._id === index + 1);
    const bookItem = chartDataRaw.weekly.bookingsAgg.find((item: any) => item._id === index + 1);
    return {
      period: dayName,
      revenue: revItem?.revenue || 0,
      bookings: bookItem?.bookings || 0,
    };
  });

  // Monthly mapping (1 - daysInMonth)
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthlyChartData = Array.from({ length: daysInMonth }, (_, index) => {
    const dayNum = index + 1;
    const revItem = chartDataRaw.monthly.settlementsAgg.find((item: any) => item._id === dayNum);
    const bookItem = chartDataRaw.monthly.bookingsAgg.find((item: any) => item._id === dayNum);
    return {
      period: dayNum.toString(),
      revenue: revItem?.revenue || 0,
      bookings: bookItem?.bookings || 0,
    };
  });

  // Yearly mapping (Jan - Dec)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yearlyChartData = months.map((monthName, index) => {
    const revItem = chartDataRaw.yearly.settlementsAgg.find((item: any) => item._id === index + 1);
    const bookItem = chartDataRaw.yearly.bookingsAgg.find((item: any) => item._id === index + 1);
    return {
      period: monthName,
      revenue: revItem?.revenue || 0,
      bookings: bookItem?.bookings || 0,
    };
  });

  const revenueChartData = {
    weekly: weeklyChartData,
    monthly: monthlyChartData,
    yearly: yearlyChartData,
  };

  // 4. Category Performance (Pie Chart)
  const categoryAgg = await getOwnerCategoryPerformance(venueIds);

  const revenueDistributionData = categoryAgg.map(item => ({
    category: item._id,
    revenue: item.revenue || 0
  }));

  // 5. Upcoming Bookings
  const upcomingBookingsRaw = await getOwnerUpcomingBookings(venueIds, 5);

  const upcomingBookings = upcomingBookingsRaw.map(b => {
    const start = new Date(b.startDateTime);
    const end = new Date(b.endDateTime);
    const dateStr = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = `${start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })} - ${end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;

    return {
      id: b._id.toString(),
      venueName: (b.venue as any)?.name || 'Unknown Venue',
      customer: (b.user as any)?.fullName || b.contactName || 'Guest',
      guests: b.guests,
      date: dateStr,
      time: timeStr,
      status: b.bookingStatus.toLowerCase() as any
    };
  });

  // 6. Top Performing Venues
  const topVenuesAgg = await getOwnerTopVenues(venueIds, 5);

  const topPerformingData = await Promise.all(topVenuesAgg.map(async (item) => {
    const venueDoc = venueDocs.find(v => v._id.toString() === item._id.toString());
    
    const last30DaysBookings = await getVenueBookingsInLast30Days(item._id);
    const totalBookedHours = last30DaysBookings.reduce((sum, b) => {
      const durationMs = new Date(b.endDateTime).getTime() - new Date(b.startDateTime).getTime();
      return sum + (durationMs / (1000 * 60 * 60));
    }, 0);
    const occupancyRate = Math.min(100, Math.round((totalBookedHours / 300) * 100)) || 0;

    return {
      id: item._id.toString(),
      name: venueDoc?.name || 'Unknown Venue',
      bookings: item.bookings,
      revenue: item.revenue,
      occupancyRate
    };
  }));

  return {
    statCardData,
    revenueChartData,
    revenueDistributionData,
    upcomingBookings,
    venueHealthData,
    topPerformingData,
  };
}

// ADMIN DASHBOARD SERVICE
export async function adminDashboardService() {
  const stats = await getAdminStats();
  const pendingActions = await getAdminPendingActions();

  // 1. Monthly revenue and platform commission chart
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  const { settlementsAgg, bookingsAgg } = await getAdminRevenueChart(startOfYear, endOfYear);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueChart = months.map((month, index) => {
    const revItem = bookingsAgg.find(item => item._id === index + 1);
    const commItem = settlementsAgg.find(item => item._id === index + 1);
    return {
      period: month,
      revenue: revItem?.revenue || 0,
      commission: commItem?.commission || 0
    };
  });

  // 2. Booking trend chart (bookings, confirmed, cancelled)
  const bookingAgg = await getAdminBookingChart(startOfYear, endOfYear);
  const bookingChart = months.map((month, index) => {
    const aggItem = bookingAgg.find(item => item._id === index + 1);
    return {
      period: month,
      bookings: aggItem?.bookings || 0,
      confirmed: aggItem?.confirmed || 0,
      cancelled: aggItem?.cancelled || 0
    };
  });

  // 3. Category performance (venues count per category)
  const dbCategoryPerf = await getAdminCategoryPerformance();
  const allCategories = await Category.find({ isActive: true });
  const categoryPerformance = allCategories.map(cat => {
    const dbItem = dbCategoryPerf.find(item => item.category === cat.name);
    return {
      category: cat.name,
      revenue: dbItem?.revenue || 0
    };
  });



  // 5. Platform Leaders
  const platformLeaders = await getAdminPlatformLeaders();

  // 6. Alerts
  const { pendingO, pendingV } = await getAdminAlerts();
  const alerts: any[] = [];
  pendingO.forEach((o) => {
    alerts.push({
      id: `owner-${o._id}`,
      title: 'Owner verification pending',
      description: `Owner ${(o.userId as any)?.fullName || 'account'} registration requires review`,
      severity: 'urgent',
      time: formatTimeAgo(o.createdAt),
    });
  });

  pendingV.forEach((v) => {
    alerts.push({
      id: `venue-${v._id}`,
      title: 'Venue approval required',
      description: `"${v.name}" was uploaded and is pending approval`,
      severity: 'critical',
      time: formatTimeAgo(v.createdAt),
    });
  });

  if (alerts.length === 0) {
    alerts.push({
      id: 'default',
      title: 'System status optimal',
      description: 'No critical operational issues detected',
      severity: 'warning',
      time: 'Just now',
    });
  }

  return {
    stats,
    pendingActions,
    revenueChart,
    bookingChart,
    categoryPerformance,
    platformLeaders,
    alerts,
  };
}
