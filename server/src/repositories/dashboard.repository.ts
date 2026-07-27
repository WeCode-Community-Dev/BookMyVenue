import Venue from '@/models/venue.model';
import Booking from '@/models/booking.model';
import Settlement from '@/models/settlement.model';
import User from '@/models/user.model';
import Owner from '@/models/owner.model';
import Category from '@/models/category.model';
import Availability from '@/models/availability.model';
import { BookingStatus } from '@/constants/booking';
import { SettlementStatus } from '@/constants/settlement';
import mongoose from 'mongoose';

// ==========================================
// OWNER DASHBOARD REPOSITORY METHODS
// ==========================================

export async function getApprovedVenues(ownerId: string) {
  const approvedVenues = await Venue.countDocuments({
    ownerId: new mongoose.Types.ObjectId(ownerId),
    verificationStatus: 'approved',
  });

  return approvedVenues;
}

export async function getOwnerVenues(ownerId: string) {
  return Venue.find({
    ownerId: new mongoose.Types.ObjectId(ownerId),
    isDeleted: { $ne: true },
  });
}

export async function getOwnerSettledRevenue(ownerId: string) {
  const [revenueResult] = await Settlement.aggregate([
    { $match: { ownerId: new mongoose.Types.ObjectId(ownerId), status: SettlementStatus.SETTLED } },
    { $group: { _id: null, totalRevenue: { $sum: '$ownerEarnings' } } },
  ]);
  return revenueResult?.totalRevenue || 0;
}

export async function getOwnerCompletedBookingsCount(venueIds: mongoose.Types.ObjectId[]) {
  return Booking.countDocuments({
    venue: { $in: venueIds },
    bookingStatus: BookingStatus.COMPLETED,
  });
}

export async function getWeeklyChartData(
  ownerId: string,
  venueIds: mongoose.Types.ObjectId[],
  startOfWeek: Date,
  endOfWeek: Date
) {
  const settlementsAgg = await Settlement.aggregate([
    {
      $match: {
        ownerId: new mongoose.Types.ObjectId(ownerId),
        status: SettlementStatus.SETTLED,
        createdAt: { $gte: startOfWeek, $lte: endOfWeek }
      }
    },
    {
      $group: {
        _id: { $isoDayOfWeek: '$createdAt' },
        revenue: { $sum: '$ownerEarnings' }
      }
    }
  ]);

  const bookingsAgg = await Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        bookingStatus: BookingStatus.COMPLETED,
        createdAt: { $gte: startOfWeek, $lte: endOfWeek }
      }
    },
    {
      $group: {
        _id: { $isoDayOfWeek: '$createdAt' },
        bookings: { $sum: 1 }
      }
    }
  ]);

  return { settlementsAgg, bookingsAgg };
}

export async function getMonthlyChartData(
  ownerId: string,
  venueIds: mongoose.Types.ObjectId[],
  startOfMonth: Date,
  endOfMonth: Date
) {
  const settlementsAgg = await Settlement.aggregate([
    {
      $match: {
        ownerId: new mongoose.Types.ObjectId(ownerId),
        status: SettlementStatus.SETTLED,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        revenue: { $sum: '$ownerEarnings' }
      }
    }
  ]);

  const bookingsAgg = await Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        bookingStatus: BookingStatus.COMPLETED,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        bookings: { $sum: 1 }
      }
    }
  ]);

  return { settlementsAgg, bookingsAgg };
}

export async function getYearlyChartData(
  ownerId: string,
  venueIds: mongoose.Types.ObjectId[],
  startOfYear: Date,
  endOfYear: Date
) {
  const settlementsAgg = await Settlement.aggregate([
    {
      $match: {
        ownerId: new mongoose.Types.ObjectId(ownerId),
        status: SettlementStatus.SETTLED,
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$ownerEarnings' }
      }
    }
  ]);

  const bookingsAgg = await Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        bookingStatus: BookingStatus.COMPLETED,
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        bookings: { $sum: 1 }
      }
    }
  ]);

  return { settlementsAgg, bookingsAgg };
}

export async function getOwnerChartData(
  ownerId: string,
  venueIds: mongoose.Types.ObjectId[]
) {
  const now = new Date();

  // Weekly range (current week: Mon - Sun)
  const day = now.getDay();
  const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Monthly range (current month)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Yearly range (current year)
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const [weekly, monthly, yearly] = await Promise.all([
    getWeeklyChartData(ownerId, venueIds, startOfWeek, endOfWeek),
    getMonthlyChartData(ownerId, venueIds, startOfMonth, endOfMonth),
    getYearlyChartData(ownerId, venueIds, startOfYear, endOfYear),
  ]);

  return { weekly, monthly, yearly };
}

export async function getOwnerCategoryPerformance(venueIds: mongoose.Types.ObjectId[]) {
  return Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        bookingStatus: BookingStatus.COMPLETED
      }
    },
    {
      $lookup: {
        from: 'venues',
        localField: 'venue',
        foreignField: '_id',
        as: 'venueInfo',
      },
    },
    { $unwind: '$venueInfo' },
    {
      $lookup: {
        from: 'categories',
        localField: 'venueInfo.categoryId',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $group: {
        _id: '$categoryInfo.name',
        revenue: { $sum: '$amountPaid' },
      },
    },
  ]);
}

export async function getOwnerUpcomingBookings(
  venueIds: mongoose.Types.ObjectId[],
  limit: number
) {
  const now = new Date();
  return Booking.find({
    venue: { $in: venueIds },
    startDateTime: { $gte: now },
    bookingStatus: { $in: [BookingStatus.CONFIRMED, BookingStatus.RESERVED] },
  })
    .sort({ startDateTime: 1 })
    .limit(limit)
    .populate('venue', 'name')
    .populate('user', 'fullName');
}

export async function getOwnerTopVenues(
  venueIds: mongoose.Types.ObjectId[],
  limit: number
) {
  return Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        bookingStatus: BookingStatus.COMPLETED
      }
    },
    {
      $group: {
        _id: '$venue',
        revenue: { $sum: '$amountPaid' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: limit },
  ]);
}

export async function getVenueBookingsInLast30Days(venueId: mongoose.Types.ObjectId) {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  return Booking.find({
    venue: venueId,
    bookingStatus: BookingStatus.COMPLETED,
    startDateTime: { $gte: last30Days },
  });
}

// ==========================================
// ADMIN DASHBOARD REPOSITORY METHODS
// ==========================================

export async function getAdminStats() {
  const totalUsers = await User.countDocuments();
  const totalVenues = await Venue.countDocuments({ isDeleted: { $ne: true } });
  const totalBookings = await Booking.countDocuments({
    bookingStatus: BookingStatus.COMPLETED,
  });

  const [revenueResult] = await Booking.aggregate([
    { $match: { bookingStatus: BookingStatus.COMPLETED } },
    { $group: { _id: null, totalRevenue: { $sum: '$amountPaid' } } },
  ]);
  const totalRevenue = revenueResult?.totalRevenue || 0;

  return { totalUsers, totalVenues, totalBookings, totalRevenue };
}

export async function getAdminPendingActions() {
  const ownerVerifications = await Owner.countDocuments({ verificationStatus: 'pending' });
  const venueApprovals = await Venue.countDocuments({ verificationStatus: 'pending', isDeleted: { $ne: true } });
  
  return {
    ownerVerifications,
    venueApprovals,
    venueUpdates: 0,
    reportedVenues: 0,
    refundRequests: 0,
  };
}

export async function getAdminRevenueChart(startOfYear: Date, endOfYear: Date) {
  const settlementsAgg = await Settlement.aggregate([
    {
      $match: {
        status: SettlementStatus.SETTLED,
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        commission: { $sum: '$platformFee' }
      }
    }
  ]);

  const bookingsAgg = await Booking.aggregate([
    {
      $match: {
        bookingStatus: BookingStatus.COMPLETED,
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$amountPaid' }
      }
    }
  ]);

  return { settlementsAgg, bookingsAgg };
}

export async function getAdminBookingChart(startOfYear: Date, endOfYear: Date) {
  return Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        bookings: { $sum: 1 },
        confirmed: {
          $sum: {
            $cond: [
              { $in: ['$bookingStatus', [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]] },
              1,
              0
            ]
          }
        },
        cancelled: {
          $sum: {
            $cond: [
              { $eq: ['$bookingStatus', BookingStatus.CANCELLED] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
}

export async function getAdminCategoryPerformance() {
  return Booking.aggregate([
    { $match: { bookingStatus: BookingStatus.COMPLETED } },
    {
      $lookup: {
        from: 'venues',
        localField: 'venue',
        foreignField: '_id',
        as: 'venueInfo',
      },
    },
    { $unwind: '$venueInfo' },
    {
      $lookup: {
        from: 'categories',
        localField: 'venueInfo.categoryId',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $group: {
        _id: '$categoryInfo.name',
        revenue: { $sum: '$amountPaid' },
      },
    },
    {
      $project: {
        category: '$_id',
        revenue: 1,
        _id: 0,
      },
    },
  ]);
}



export async function getAdminPlatformLeaders() {
  const topRev = await Booking.aggregate([
    { $match: { bookingStatus: BookingStatus.COMPLETED } },
    { $group: { _id: '$venue', total: { $sum: '$amountPaid' } } },
    { $sort: { total: -1 } },
    { $limit: 1 }
  ]);
  let topRevenueVenueName = 'None';
  let topRevenueMetric = '₹0';
  if (topRev.length > 0) {
    const v = await Venue.findById(topRev[0]._id);
    if (v) {
      topRevenueVenueName = v.name;
      topRevenueMetric = `₹${topRev[0].total.toLocaleString()}`;
    }
  } else {
    const topAvailability = await Availability.findOne().sort({ pricePerHour: -1 });
    let fallbackVenue = null;
    if (topAvailability) {
      fallbackVenue = await Venue.findById(topAvailability.venueId);
    } else {
      fallbackVenue = await Venue.findOne({ isDeleted: { $ne: true } });
    }
    if (fallbackVenue) {
      topRevenueVenueName = fallbackVenue.name;
      const price = (fallbackVenue as any).pricePerHour || 0;
      topRevenueMetric = `₹${price.toLocaleString()} / Hour`;
    }
  }

  const topBooked = await Booking.aggregate([
    { $group: { _id: '$venue', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  let mostBookedName = 'None';
  let mostBookedMetric = '0 Bookings';
  if (topBooked.length > 0) {
    const v = await Venue.findById(topBooked[0]._id);
    if (v) {
      mostBookedName = v.name;
      mostBookedMetric = `${topBooked[0].count} Bookings`;
    }
  }

  const eliteVenue = await Venue.findOne({ isElite: true, isDeleted: { $ne: true } }) || 
                     await Venue.findOne({ isFeatured: true, isDeleted: { $ne: true } }) || 
                     await Venue.findOne({ isDeleted: { $ne: true } });
  let highestRatedName = 'None';
  let highestRatedMetric = '0.0 Rating';
  if (eliteVenue) {
    highestRatedName = eliteVenue.name;
    highestRatedMetric = 'Elite Tier';
  }

  const topOwners = await Venue.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$ownerId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);
  let topOwnerName = 'None';
  let topOwnerMetric = '0 Venues';
  if (topOwners.length > 0) {
    const ownerInfo = await Owner.findById(topOwners[0]._id).populate('userId');
    if (ownerInfo && ownerInfo.userId) {
      topOwnerName = (ownerInfo.userId as any).fullName || 'Platform Owner';
      topOwnerMetric = `${topOwners[0].count} Venues`;
    }
  }

  const leaders = [
    { rank: 1, title: 'Top Revenue Venue', name: topRevenueVenueName, metric: topRevenueMetric },
    { rank: 2, title: 'Most Booked Venue', name: mostBookedName, metric: mostBookedMetric },
    { rank: 3, title: 'Highest Rated Venue', name: highestRatedName, metric: highestRatedMetric },
    { rank: 4, title: 'Top Owner', name: topOwnerName, metric: topOwnerMetric }
  ];

  return leaders;
}

export async function getAdminAlerts() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const pendingO = await Owner.find({
    verificationStatus: 'pending',
    createdAt: { $lt: sevenDaysAgo }
  }).populate('userId').limit(2);

  const pendingV = await Venue.find({
    verificationStatus: 'pending',
    isDeleted: { $ne: true },
    createdAt: { $lt: sevenDaysAgo }
  }).limit(2);

  return { pendingO, pendingV };
}

export async function getAdminChartData() {
  const now = new Date();

  // Weekly range (current week: Mon - Sun)
  const day = now.getDay();
  const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Monthly range (current month)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Yearly range (current year)
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const [
    settlementsWeekly, bookingsWeekly, bookingsTrendWeekly,
    settlementsMonthly, bookingsMonthly, bookingsTrendMonthly,
    settlementsYearly, bookingsYearly, bookingsTrendYearly
  ] = await Promise.all([
    Settlement.aggregate([
      { $match: { status: SettlementStatus.SETTLED, createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      { $group: { _id: { $isoDayOfWeek: '$createdAt' }, commission: { $sum: '$platformFee' } } }
    ]),
    Booking.aggregate([
      { $match: { bookingStatus: BookingStatus.COMPLETED, createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      { $group: { _id: { $isoDayOfWeek: '$createdAt' }, revenue: { $sum: '$amountPaid' } } }
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      {
        $group: {
          _id: { $isoDayOfWeek: '$createdAt' },
          bookings: { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $in: ['$bookingStatus', [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$bookingStatus', BookingStatus.CANCELLED] }, 1, 0] } }
        }
      }
    ]),
    Settlement.aggregate([
      { $match: { status: SettlementStatus.SETTLED, createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: { $dayOfMonth: '$createdAt' }, commission: { $sum: '$platformFee' } } }
    ]),
    Booking.aggregate([
      { $match: { bookingStatus: BookingStatus.COMPLETED, createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: { $dayOfMonth: '$createdAt' }, revenue: { $sum: '$amountPaid' } } }
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: { $dayOfMonth: '$createdAt' },
          bookings: { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $in: ['$bookingStatus', [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$bookingStatus', BookingStatus.CANCELLED] }, 1, 0] } }
        }
      }
    ]),
    Settlement.aggregate([
      { $match: { status: SettlementStatus.SETTLED, createdAt: { $gte: startOfYear, $lte: endOfYear } } },
      { $group: { _id: { $month: '$createdAt' }, commission: { $sum: '$platformFee' } } }
    ]),
    Booking.aggregate([
      { $match: { bookingStatus: BookingStatus.COMPLETED, createdAt: { $gte: startOfYear, $lte: endOfYear } } },
      { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$amountPaid' } } }
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          bookings: { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $in: ['$bookingStatus', [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$bookingStatus', BookingStatus.CANCELLED] }, 1, 0] } }
        }
      }
    ])
  ]);

  return {
    weekly: { settlementsAgg: settlementsWeekly, bookingsAgg: bookingsWeekly, bookingsTrendAgg: bookingsTrendWeekly },
    monthly: { settlementsAgg: settlementsMonthly, bookingsAgg: bookingsMonthly, bookingsTrendAgg: bookingsTrendMonthly },
    yearly: { settlementsAgg: settlementsYearly, bookingsAgg: bookingsYearly, bookingsTrendAgg: bookingsTrendYearly }
  };
}
