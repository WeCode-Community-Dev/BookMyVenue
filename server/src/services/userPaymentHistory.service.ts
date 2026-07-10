import mongoose from 'mongoose';
import Booking from '@/models/booking.model';

export const getPaymentHistory = async (
  userId: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    paymentStatus?: string;
    sort?: string;
  }
) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const query: any = { user: new mongoose.Types.ObjectId(userId) };

  if (options.paymentStatus) {
    if (options.paymentStatus === 'REFUNDED') {
      query.refundStatus = { $in: ['PENDING', 'PROCESSING', 'COMPLETED'] };
    } else {
      query.paymentStatus = options.paymentStatus;
      query.refundStatus = { $nin: ['PENDING', 'PROCESSING', 'COMPLETED'] };
    }
  }

  if (options.search) {
    if (mongoose.Types.ObjectId.isValid(options.search)) {
      query._id = new mongoose.Types.ObjectId(options.search);
    } else {
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
    id: `BK-${booking._id.toString().slice(17).toUpperCase()}`,
    venueName: booking.venue?.name || 'Unknown Venue',
    date: booking.createdAt,
    totalAmount: booking.totalAmount,
    amountPaid: booking.amountPaid,
    refundAmount: booking.refundAmount,
    paymentStatus: booking.paymentStatus,
    bookingStatus: booking.bookingStatus,
  }));

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
