import { Types } from 'mongoose';
import { BookingModel } from '../booking/models/booking.model';
import { VenueModel } from '../venue/venue.model';
import { BookingStatus } from '../../constants/booking.constants';
import { PaymentStatus } from '../../constants/payment.constants';
import type { IBooking, AggregatedBooking } from '../booking/booking.types';
import type { IVenue } from '../venue/venue.types';

export async function getVenueAnalyticsData(venueId: string): Promise<Record<string, unknown>[]> {
  const pipeline = [
    {
      $match: {
        venueId: new Types.ObjectId(venueId),
        status: { $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
      },
    },
    {
      $group: {
        _id: {
          year: { $substrCP: ['$date', 0, 4] },
          month: { $substrCP: ['$date', 5, 2] },
        },
        revenue: { $sum: '$price' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } as Record<string, 1 | -1> },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        revenue: 1,
        count: 1,
      },
    },
  ];

  return BookingModel.aggregate(pipeline);
}

export async function getVenueBookingsPaginated(
  venueId: string,
  skip: number,
  limit: number
): Promise<Record<string, unknown>[]> {
  interface OwnerAggregatedBooking extends AggregatedBooking {
    bookerName?: string;
    bookerEmail?: string;
    bookerPhone?: string;
  }
  const bookings = await BookingModel.aggregate<OwnerAggregatedBooking>([
    { $match: { venueId: new Types.ObjectId(venueId) } },
    { $sort: { date: -1, startTime: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'Venues',
        localField: 'venueId',
        foreignField: '_id',
        as: 'venue',
      },
    },
    { $unwind: '$venue' },
    {
      $lookup: {
        from: 'Users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        bookerEmail: '$bookerInfo.email',
        bookerPhone: '$bookerInfo.phone',
        bookerName: '$bookerInfo.name',
      },
    },
    {
      $project: {
        'venue._id': 1,
        'venue.name': 1,
        'venue.city': 1,
        'venue.address': 1,
        'user._id': 1,
        'user.username': 1,
        'user.email': 1,
        'user.phone': 1,
        _id: 1,
        date: 1,
        startTime: 1,
        endTime: 1,
        price: 1,
        status: 1,
        paymentStatus: 1,
        paymentMethod: 1,
        paymentReference: 1,
        bookerName: 1,
        bookerEmail: 1,
        bookerPhone: 1,
        createdAt: 1,
        eventType: 1,
        userId: 1,
        bookerInfo: 1,
      },
    },
  ]);

  const now = new Date();
  const result: Record<string, unknown>[] = [];
  for (const b of bookings) {
    let uiStatus: string;
    if (b.status === BookingStatus.CANCELLED) {
      uiStatus = 'cancelled';
    } else if (b.status === BookingStatus.COMPLETED) {
      uiStatus = 'completed';
    } else {
      const eventEnd = new Date(`${b.date}T00:00:00`);
      eventEnd.setMinutes(b.endTime);
      uiStatus = eventEnd < now ? 'completed' : 'confirmed';
    }
    result.push({ ...b, uiStatus });
  }
  return result;
}

export async function countVenueBookings(venueId: string): Promise<number> {
  return BookingModel.countDocuments({ venueId: new Types.ObjectId(venueId) });
}

export async function createOfflineBookingRecord(
  venueId: string,
  userId: string,
  date: string,
  startTime: number,
  endTime: number,
  price: number,
  customerName: string,
  phone: string
): Promise<IBooking> {
  return BookingModel.create({
    venueId: new Types.ObjectId(venueId),
    userId: new Types.ObjectId(userId),
    date,
    startTime,
    endTime,
    price,
    paymentReference: `OFFLINE-${Date.now().toString()}`,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: 'offline',
    bookerInfo: {
      name: customerName,
      phone: phone,
    },
  });
}

export async function getVenueBlockedDatesAndWorkingDays(venueId: string): Promise<IVenue | null> {
  return VenueModel.findById(venueId)
    .select('blockedDates workingDays temporaryBlockAfterDate inactivity.blockedAfterDate')
    .lean()
    .exec();
}

export async function getConfirmedBookingsAfterDate(
  venueId: string,
  dateThreshold: string
): Promise<IBooking[]> {
  return BookingModel.find({
    venueId: new Types.ObjectId(venueId),
    status: { $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
    date: { $gte: dateThreshold },
  })
    .select('date')
    .lean()
    .exec();
}

export async function findConflictingBookingForDates(
  venueId: string,
  dates: string[]
): Promise<IBooking | null> {
  return BookingModel.findOne({
    venueId: new Types.ObjectId(venueId),
    status: BookingStatus.CONFIRMED,
    date: { $in: dates },
  })
    .lean()
    .exec();
}

export async function addBlockedDatesToVenue(
  venueId: string,
  dates: Date[]
): Promise<IVenue | null> {
  return VenueModel.findByIdAndUpdate(
    venueId,
    {
      $addToSet: {
        blockedDates: { $each: dates },
      },
    },
    { new: true }
  )
    .select('blockedDates')
    .lean()
    .exec();
}

export async function markBookingAsPaid(bookingId: string): Promise<IBooking | null> {
  return BookingModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(bookingId),
      paymentReference: /^OFFLINE-/,
      paymentStatus: PaymentStatus.PENDING,
    },
    { $set: { paymentStatus: PaymentStatus.PAID } },
    { new: true }
  ).lean();
}

export async function cancelPendingOfflineBooking(bookingId: string): Promise<IBooking | null> {
  return BookingModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(bookingId),
      paymentStatus: PaymentStatus.PENDING,
    },
    { $set: { status: BookingStatus.CANCELLED } },
    { new: true }
  ).lean();
}

export async function removeBlockedDatesFromVenue(
  venueId: string,
  dates: Date[]
): Promise<IVenue | null> {
  return VenueModel.findByIdAndUpdate(
    venueId,
    {
      $pullAll: {
        blockedDates: dates,
      },
    },
    { new: true }
  )
    .select('blockedDates')
    .lean()
    .exec();
}
