import Venue from '@/models/venue.model';
import Booking from '@/models/booking.model';
import { BookingStatus } from '@/constants/booking';
import mongoose from 'mongoose';

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

export async function getOwnerStats(venueIds: mongoose.Types.ObjectId[]) {
  const statsAgg = await Booking.aggregate([
    { $match: { venue: { $in: venueIds } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amountPaid' },
        totalBookings: { $sum: 1 },
      },
    },
  ]);
  return {
    totalRevenue: statsAgg[0]?.totalRevenue || 0,
    totalBookings: statsAgg[0]?.totalBookings || 0,
  };
}

export async function getOwnerMonthlyChartData(
  venueIds: mongoose.Types.ObjectId[],
  startOfYear: Date,
  endOfYear: Date
) {
  return Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$amountPaid' },
        bookings: { $sum: 1 },
      },
    },
  ]);
}

export async function getOwnerCategoryPerformance(venueIds: mongoose.Types.ObjectId[]) {
  return Booking.aggregate([
    { $match: { venue: { $in: venueIds } } },
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
    { $match: { venue: { $in: venueIds } } },
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
    startDateTime: { $gte: last30Days },
  });
}
