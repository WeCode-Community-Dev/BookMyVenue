import mongoose from 'mongoose';
import Booking from '@/models/booking.model';

export const getPaymentHistory = async (
  userId: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    paymentStatus?: string;
    refundStatus?: string;
    sort?: string;
  }
) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // We only show bookings that have some financial transaction (e.g. not purely free/unpaid if that matters)
  // For now, let's include all bookings since they all have payment/refund statuses.
  const query: any = { user: new mongoose.Types.ObjectId(userId) };

  if (options.paymentStatus) {
    query.paymentStatus = options.paymentStatus;
  }
  
  if (options.refundStatus) {
    query.refundStatus = options.refundStatus;
  }

  if (options.search) {
    // If it's a valid object ID, search by ID
    if (mongoose.Types.ObjectId.isValid(options.search)) {
      query._id = new mongoose.Types.ObjectId(options.search);
    } else {
      // Otherwise search by contact name or email as a fallback, or we can just ignore if it's not an ID
      query.$or = [
        { contactName: { $regex: options.search, $options: 'i' } },
      ];
    }
  }

  let sortOption: any = { createdAt: -1 };
  if (options.sort) {
    if (options.sort === 'oldest') sortOption = { createdAt: 1 };
    else if (options.sort === 'highestAmount') sortOption = { totalAmount: -1 };
    else if (options.sort === 'lowestAmount') sortOption = { totalAmount: 1 };
  }

  const [bookings, total] = await Promise.all([
    Booking.find(query).populate('venue', 'name').sort(sortOption).skip(skip).limit(limit),
    Booking.countDocuments(query),
  ]);

  const data = bookings.map((booking: any) => ({
    id: booking._id,
    venueName: booking.venue?.name || 'Unknown Venue',
    date: booking.createdAt,
    totalAmount: booking.totalAmount,
    amountPaid: booking.amountPaid,
    refundAmount: booking.refundAmount,
    paymentStatus: booking.paymentStatus,
    refundStatus: booking.refundStatus,
    bookingStatus: booking.bookingStatus,
  }));

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
