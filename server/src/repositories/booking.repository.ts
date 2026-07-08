import Booking from '@/models/booking.model';
import { IBooking, CreateBookingPayload } from '@/types/booking.types';
import { BookingStatus, BookingScenario, PaymentMethod, PaymentStatus, RefundStatus, CancellationType } from '@/constants/booking';
import mongoose, { ClientSession } from 'mongoose';

// ── Types ───────────────────────────────────────────────────

interface ReservationDetails {
  totalAmount: number;
  reservationDeposit: number;
  remainingBalance: number;
  bookingScenario: BookingScenario;
  remainingPaymentDueDate: Date | null;
  autoCancellationDate: Date | null;
  isImmediatePaymentRequired: boolean;
}

// ── Create ──────────────────────────────────────────────────

export const createBooking = async (
  userId: string,
  payload: CreateBookingPayload,
  reservation: ReservationDetails
): Promise<IBooking> => {
  const doc = await Booking.create({
    venue: new mongoose.Types.ObjectId(payload.venueId),
    user: new mongoose.Types.ObjectId(userId),
    startDateTime: new Date(payload.startDateTime),
    endDateTime: new Date(payload.endDateTime),
    guests: payload.guests,
    contactName: payload.contactName,
    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone,
    specialRequests: payload.specialRequests || '',
    bookingScenario: reservation.bookingScenario,
    paymentMethod: PaymentMethod.RAZORPAY,
    bookingStatus: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    totalAmount: reservation.totalAmount,
    reservationDeposit: reservation.reservationDeposit,
    remainingBalance: reservation.remainingBalance,
    amountPaid: 0,
    remainingPaymentDueDate: reservation.remainingPaymentDueDate,
    autoCancellationDate: reservation.autoCancellationDate,
    isImmediatePaymentRequired: reservation.isImmediatePaymentRequired,
  });

  return doc as IBooking;
};

// ── Read ────────────────────────────────────────────────────

export const findBookingById = async (id: string): Promise<IBooking | null> => {
  return Booking.findById(id)
    .populate('venue', 'name address images')
    .populate('user', 'fullName email') as Promise<IBooking | null>;
};

export const getBookingByVenueId = async (id: string): Promise<IBooking[] | null> => {
  const today = new Date();

  const filter = {
    venue: new mongoose.Types.ObjectId(id),
    startDateTime: {
      $gte: today,
    },
  };

  return Booking.find(filter);
};

export const findBookingsByUser = async (
  userId: string,
  page: number,
  limit: number,
  status?: string
) => {
  const filter: Record<string, any> = { user: new mongoose.Types.ObjectId(userId) };
  if (status && status !== 'all') filter.bookingStatus = status;

  const skip = (page - 1) * limit;
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('venue', 'name address images categoryId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const findBookingsByVenue = async (
  venueId: string,
  page: number,
  limit: number,
  status?: string
) => {
  const filter: Record<string, any> = { venue: new mongoose.Types.ObjectId(venueId) };
  if (status && status !== 'all') filter.bookingStatus = status;

  const skip = (page - 1) * limit;
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const findAllBookings = async (
  page: number,
  limit: number,
  status?: string,
  venueId?: string
) => {
  const filter: Record<string, any> = {};
  if (status && status !== 'all') filter.bookingStatus = status;
  if (venueId) filter.venue = new mongoose.Types.ObjectId(venueId);

  const skip = (page - 1) * limit;
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('venue', 'name address')
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// ── Overlap check ───────────────────────────────────────────

/**
 * Returns true if an active booking exists for this venue that
 * overlaps with [startDateTime, endDateTime].
 */
export const hasOverlappingBooking = async (
  venueId: string,
  startDateTime: Date,
  endDateTime: Date,
  excludeBookingId?: string
): Promise<boolean> => {
  const filter: Record<string, any> = {
    venue: new mongoose.Types.ObjectId(venueId),
    bookingStatus: { $in: [BookingStatus.CONFIRMED, BookingStatus.RESERVED] },
    startDateTime: { $lt: endDateTime },
    endDateTime: { $gt: startDateTime },
  };

  if (excludeBookingId) {
    filter._id = { $ne: new mongoose.Types.ObjectId(excludeBookingId) };
  }

  return (await Booking.countDocuments(filter)) > 0;
};

// ── Update ──────────────────────────────────────────────────

/**
 * Confirms the deposit payment (20%).
 * Sets status to RESERVED + DEPOSIT_PAID.
 */
export const confirmDepositPayment = async (
  bookingId: string,
  depositAmount: number
): Promise<IBooking | null> => {
  return Booking.findByIdAndUpdate(
    bookingId,
    {
      bookingStatus: BookingStatus.RESERVED,
      paymentStatus: PaymentStatus.PARTIAL,
      amountPaid: depositAmount,
    },
    { new: true }
  )
    .populate('venue', 'name address images')
    .populate('user', 'fullName email') as Promise<IBooking | null>;
};

/**
 * Confirms full payment (100%).
 * Sets status to CONFIRMED + PAID.
 */
export const confirmFullPayment = async (
  bookingId: string,
  totalAmount: number
): Promise<IBooking | null> => {
  return Booking.findByIdAndUpdate(
    bookingId,
    {
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      amountPaid: totalAmount,
    },
    { new: true }
  )
    .populate('venue', 'name address images')
    .populate('user', 'fullName email') as Promise<IBooking | null>;
};

export const updateBookingStatus = async (
  id: string,
  bookingStatus: BookingStatus
): Promise<IBooking | null> => {
  return Booking.findByIdAndUpdate(
    id,
    { bookingStatus },
    { new: true }
  ) as Promise<IBooking | null>;
};

export const cancelBooking = async (
  id: string,
  cancellationReason: string,
  session: mongoose.ClientSession,
  cancellationDetails?: {
    cancellationType: string;
    refundStatus: string;
    refundAmount: number;
  }
): Promise<IBooking | null> => {
  return Booking.findByIdAndUpdate(
    id,
    {
      bookingStatus: BookingStatus.CANCELLED,
      cancellationReason,
      cancelledAt: new Date(),
      ...(cancellationDetails ? cancellationDetails : {}),
    },
    { new: true, session }
  ) as Promise<IBooking | null>;
};

export const updatePaymentStatus = async (
  id: string,
  paymentStatus: PaymentStatus,
  amountPaid?: number
): Promise<IBooking | null> => {
  const update: Record<string, any> = { paymentStatus };
  if (amountPaid !== undefined) update.amountPaid = amountPaid;
  return Booking.findByIdAndUpdate(id, update, { new: true }) as Promise<IBooking | null>;
};

// ── Delete ──────────────────────────────────────────────────

export const deleteBookingById = async (id: string): Promise<boolean> => {
  const res = await Booking.findByIdAndDelete(id);
  return res !== null;
};


export const updateRefundBookingStatus = async (
  bookingId: string,
  refundStatus: RefundStatus,
  session: ClientSession
) => {
  const doc = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      refundStatus,
      cancellationType: CancellationType.USER,
      bookingStatus: BookingStatus.CANCELLED,
    },
    { refundStatus: RefundStatus.PROCESSING },
    { session, new: true }
  );
  return doc
}

export const findFailedRefundBookings = async () => {
  const docs = await Booking.find({
    bookingStatus: BookingStatus.CANCELLED,
    cancellationType: CancellationType.USER,
    refundStatus: RefundStatus.FAILED,
    refundAmount: { $gt: 0 },
  }).select('_id refundStatus refundAmount user');

  return docs;
}