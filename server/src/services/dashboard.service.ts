import {
  getApprovedVenues,
  getOwnerVenues,
  getOwnerStats,
  getOwnerMonthlyChartData,
  getOwnerCategoryPerformance,
  getOwnerUpcomingBookings,
  getOwnerTopVenues,
  getVenueBookingsInLast30Days,
} from '@/repositories/dashboard.repository';
import type { OwnerDashboard } from '@/types/dashbboard.types';
import User from '@/models/user.model';
import Venue from '@/models/venue.model';
import Category from '@/models/category.model';
import Owner from '@/models/owner.model';
import Availability from '@/models/availability.model';
import mongoose from 'mongoose';

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
  const venueDocs = await getOwnerVenues(ownerId);
  const venueIds = venueDocs.map(v => v._id);

  if (venueIds.length === 0) {
    return {
      statCardData: [
        { title: 'Total Revenue', value: '₹0' },
        { title: 'Total Bookings', value: 0 },
        { title: 'Active Venues', value: 0 },
        { title: 'Avg Rating', value: '0.0' },
      ],
      revenueChartData: [],
      revenueDistributionData: [],
      upcomingBookings: [],
      venueHealthData: {
        totalVenues: 0,
        activeVenues: 0,
        pendingVenues: 0,
        rejectedVenues: 0,
      },
      topPerformingData: [],
    };
  }

  // 1. Venue Health Data
  let totalVenues = venueDocs.length;
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
  const { totalRevenue, totalBookings } = await getOwnerStats(venueIds);

  const statCardData: any[] = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}` },
    { title: 'Total Bookings', value: totalBookings },
    { title: 'Active Venues', value: activeVenues },
    { title: 'Avg Rating', value: '0.0' },
  ];

  // 3. Monthly Revenue & Bookings Chart Data for Current Year
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  const monthlyAgg = await getOwnerMonthlyChartData(venueIds, startOfYear, endOfYear);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueChartData = months.map((month, index) => {
    const aggItem = monthlyAgg.find(item => item._id === index + 1);
    return {
      period: month,
      revenue: aggItem?.revenue || 0,
      bookings: aggItem?.bookings || 0
    };
  });

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
  const totalUsers = await User.countDocuments();
  const totalVenues = await Venue.countDocuments();
  const totalBookings = 0;
  const totalRevenue = 0;

  const ownerVerifications = await Owner.countDocuments({ verificationStatus: 'pending' });
  const venueApprovals = await Venue.countDocuments({ verificationStatus: 'pending' });

  // 1. Category performance (venues count per category)
  const categories = await Category.find({ isActive: true });
  const categoryPerformance = await Promise.all(
    categories.map(async (cat) => {
      const count = await Venue.countDocuments({ categoryId: cat._id });
      return {
        category: cat.name,
        revenue: count * 50000,
      };
    })
  );

  // 2. Recent activities
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);
  const recentVenues = await Venue.find().sort({ createdAt: -1 }).limit(3);

  const recentActivity: any[] = [];
  recentUsers.forEach((u) => {
    recentActivity.push({
      title: 'New user registered',
      description: `${u.fullName} signed up on the platform`,
      time: formatTimeAgo(u.createdAt),
      type: u.role === 'owner' ? 'owner_register' : 'booking_confirm',
    });
  });

  recentVenues.forEach((v) => {
    recentActivity.push({
      title: 'Venue submitted',
      description: `"${v.name}" was submitted for review`,
      time: formatTimeAgo(v.createdAt),
      type: 'venue_submit',
    });
  });

  // 3. Platform Leaders
  const platformLeaders: any[] = [];
  const topAvailability = await Availability.findOne().sort({ pricePerHour: -1 });
  let topRevenueVenue = null;
  if (topAvailability) {
    topRevenueVenue = await Venue.findById(topAvailability.venueId).populate('availability');
  } else {
    topRevenueVenue = await Venue.findOne().populate('availability');
  }

  if (topRevenueVenue) {
    const price = (topRevenueVenue as any).availability?.pricePerHour || 0;
    platformLeaders.push({
      rank: 1,
      title: 'Top Revenue Venue',
      name: topRevenueVenue.name,
      metric: `₹${price.toLocaleString()} / Hour`,
    });
  }

  const topCapacityVenue = await Venue.findOne().sort({ capacity: -1 });
  if (topCapacityVenue) {
    platformLeaders.push({
      rank: 2,
      title: 'Most Booked Venue',
      name: topCapacityVenue.name,
      metric: `${topCapacityVenue.capacity} Capacity`,
    });
  }

  const eliteVenue =
    (await Venue.findOne({ isElite: true })) || (await Venue.findOne({ isFeatured: true }));
  if (eliteVenue) {
    platformLeaders.push({
      rank: 3,
      title: 'Highest Rated Venue',
      name: eliteVenue.name,
      metric: 'Elite Tier',
    });
  }

  // Find top owner
  const topOwners = await Venue.aggregate([
    { $group: { _id: '$ownerId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);
  if (topOwners.length > 0) {
    const ownerInfo = await Owner.findById(topOwners[0]._id).populate('userId');
    const ownerName = (ownerInfo?.userId as any)?.fullName || 'Platform Owner';
    platformLeaders.push({
      rank: 4,
      title: 'Top Owner',
      name: ownerName,
      metric: `${topOwners[0].count} Venues`,
    });
  }

  if (platformLeaders.length === 0) {
    platformLeaders.push(
      { rank: 1, title: 'Top Revenue Venue', name: 'None Yet', metric: '₹0' },
      { rank: 2, title: 'Most Booked Venue', name: 'None Yet', metric: '0 Bookings' },
      { rank: 3, title: 'Highest Rated Venue', name: 'None Yet', metric: '0.0 Rating' },
      { rank: 4, title: 'Top Owner', name: 'None Yet', metric: '0 Venues' }
    );
  }

  // 4. Alerts
  const alerts: any[] = [];
  const pendingO = await Owner.find({ verificationStatus: 'pending' }).populate('userId').limit(2);
  pendingO.forEach((o) => {
    alerts.push({
      id: `owner-${o._id}`,
      title: 'Owner verification pending',
      description: `Owner ${(o.userId as any)?.fullName || 'account'} registration requires review`,
      severity: 'urgent',
      time: formatTimeAgo(o.createdAt),
    });
  });

  const pendingV = await Venue.find({ verificationStatus: 'pending' }).limit(2);
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
    stats: {
      totalUsers,
      totalVenues,
      totalBookings,
      totalRevenue,
    },
    pendingActions: {
      ownerVerifications,
      venueApprovals,
      venueUpdates: 0,
      reportedVenues: 0,
      refundRequests: 0,
    },
    revenueChart: [],
    bookingChart: [],
    categoryPerformance,
    recentActivity,
    platformLeaders,
    alerts,
  };
}
