import BookingModel from "../models/booking.model";
import { BookingStatusEnum } from "../enums/booking-enum";

export const COMMISSION_RATE = 0.1;

export const getRevenueSummaryService = async () => {
  const matchConfirmed = { bookingStatus: BookingStatusEnum.CONFIRMED };

  const [totals] = await BookingModel.aggregate([
    { $match: matchConfirmed },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalBookings: { $sum: 1 },
      },
    },
  ]);

  const totalRevenue = totals?.totalRevenue ?? 0;
  const totalBookings = totals?.totalBookings ?? 0;
  const platformCommission = Math.round(totalRevenue * COMMISSION_RATE);
  const ownerPayout = totalRevenue - platformCommission;

  const venues = await BookingModel.aggregate([
    { $match: matchConfirmed },
    {
      $group: {
        _id: "$venue",
        revenue: { $sum: "$totalAmount" },
        bookings: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "venues",
        localField: "_id",
        foreignField: "_id",
        as: "venue",
      },
    },
    { $unwind: "$venue" },
    {
      $lookup: {
        from: "users",
        localField: "venue.owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        venueId: "$_id",
        venueName: "$venue.name",
        ownerName: "$owner.name",
        bookings: 1,
        revenue: 1,
        commission: { $round: [{ $multiply: ["$revenue", COMMISSION_RATE] }, 0] },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  return {
    commissionRate: COMMISSION_RATE,
    totalRevenue,
    totalBookings,
    platformCommission,
    ownerPayout,
    venues,
  };
};
