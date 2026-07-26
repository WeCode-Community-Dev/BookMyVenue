import { Types, type ClientSession } from 'mongoose';
import { buildPaginationMeta } from '../../utils/paginationUtils';
import { BookingStatus, type BookingStatusType } from '../../constants/booking.constants';
import { PaymentStatus, type PaymentStatusType } from '../../constants/payment.constants';
import { LockModel } from './models/lock.model';
import { BookingModel } from './models/booking.model';
import { FailedBookingModel } from './models/failedBooking.model';
import { ProcessedWebhookModel } from './models/processedWebhook.model';
import { VenueModel } from '../venue/venue.model';
import type { IVenue, IRefundRule } from '../venue/venue.types';
import type { IBooking } from './booking.types';
import type { ILock, IContractSnapshot } from './lock.types';
import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import { minutesToTimeString } from '../../utils/timeUtils';

function resolveRefundPct(venueRaw: unknown, bookingDate: string): { pct: number; label: string } {
  const venue = venueRaw as IVenue;

  if (venue.cancellation.policy !== 'refundable') {
    return { pct: 0, label: 'Non-refundable' };
  }

  const rules: IRefundRule[] = venue.cancellation.refundRules;
  if (rules.length === 0) {
    if (venue.cancellation.refundType === 'fullRefund') {
      return { pct: 100, label: 'Full Refund' };
    }
    return { pct: 0, label: 'Non-refundable' };
  }

  const sortedRules = [...rules].sort((a, b) => b.daysBefore - a.daysBefore);

  const nowMs = Date.now();
  const bookingDateMs = new Date(`${bookingDate}T00:00:00`).getTime();
  const daysUntilBooking = Math.floor((bookingDateMs - nowMs) / (1000 * 60 * 60 * 24));

  const matchedRule = sortedRules.find((rule) => daysUntilBooking >= rule.daysBefore);

  if (matchedRule) {
    return {
      pct: matchedRule.refundPercentage,
      label: `Refundable (${String(matchedRule.refundPercentage)}% up to ${String(matchedRule.daysBefore)} days before)`,
    };
  }

  return { pct: 0, label: 'Non-refundable' };
}

export function resolveRefundPctFromSnapshot(
  cancellation: IContractSnapshot['cancellation'],
  bookingDate: string
): { pct: number; label: string } {
  if (cancellation.policy !== 'refundable') {
    return { pct: 0, label: 'Non-refundable' };
  }

  const rules = cancellation.refundRules;
  if (rules.length === 0) {
    if (cancellation.refundType === 'fullRefund') {
      return { pct: 100, label: 'Full Refund' };
    }
    return { pct: 0, label: 'Non-refundable' };
  }

  const sortedRules = [...rules].sort((a, b) => b.daysBefore - a.daysBefore);
  const nowMs = Date.now();
  const bookingDateMs = new Date(`${bookingDate}T00:00:00`).getTime();
  const daysUntilBooking = Math.floor((bookingDateMs - nowMs) / (1000 * 60 * 60 * 24));

  const matchedRule = sortedRules.find((rule) => daysUntilBooking >= rule.daysBefore);
  if (matchedRule) {
    return {
      pct: matchedRule.refundPercentage,
      label: `Refundable (${String(matchedRule.refundPercentage)}% up to ${String(matchedRule.daysBefore)} days before)`,
    };
  }

  return { pct: 0, label: 'Non-refundable' };
}

export interface AggregatedBooking {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  venueId: Types.ObjectId;
  date: string;
  startTime: number;
  endTime: number;
  price: number;
  paymentReference: string;
  status: BookingStatusType;
  paymentStatus?: PaymentStatusType;
  guestCount?: number;
  eventType?: string;
  bookerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    place?: string;
    note?: string;
  };
  paymentMethod?: string;
  advancePaid?: number;
  remainingAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  venue: IVenue & { _id: Types.ObjectId };
  contractSnapshot?: IContractSnapshot;
}

export async function fetchMyBookings(userId: string): Promise<{
  bookings: {
    upcoming: Record<string, unknown>[];
    cancelled: Record<string, unknown>[];
    completed: Record<string, unknown>[];
  };
}> {
  const bookings = await BookingModel.aggregate<AggregatedBooking>([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'Venues',
        localField: 'venueId',
        foreignField: '_id',
        as: 'venue',
      },
    },
    { $unwind: '$venue' },
    { $sort: { date: 1, startTime: 1 } },
  ]);

  const now = new Date();
  const upcoming = [];
  const cancelled = [];
  const completed = [];

  for (const b of bookings) {
    const bookingStart = new Date(`${b.date}T00:00:00`);
    bookingStart.setMinutes(b.startTime);
    const bookingEnd = new Date(`${b.date}T00:00:00`);
    bookingEnd.setMinutes(b.endTime);

    let uiStatus: string;
    if (b.status === BookingStatus.CANCELLED) {
      uiStatus = 'cancelled';
    } else if (b.status === BookingStatus.COMPLETED) {
      uiStatus = 'completed';
    } else if (b.status === BookingStatus.IN_PROGRESS) {
      uiStatus = 'in_progress';
    } else if (bookingEnd < now) {
      uiStatus = 'completed';
    } else if (bookingStart <= now && bookingEnd > now) {
      uiStatus = 'in_progress';
    } else {
      uiStatus = 'upcoming';
    }

    const dto = {
      _id: b._id.toString(),
      bookingRef: `BMV-${b._id.toString().slice(-6).toUpperCase()}`,
      venueName: b.venue.name,
      venueId: b.venue._id.toString(),
      city: b.venue.city,
      district: b.venue.district,
      coverImage: b.venue.coverImage,
      date: new Date(b.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      timeRange: `${minutesToTimeString(b.startTime)} - ${minutesToTimeString(b.endTime)}`,
      bookedOn: new Date(b.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      guestCount: b.guestCount,
      eventType: b.eventType,
      totalPrice: b.price,
      paymentMethod: b.paymentMethod,
      status: b.status,
      paymentStatus: b.paymentStatus,
      uiStatus,
    };

    if (uiStatus === 'cancelled') cancelled.push(dto);
    else if (uiStatus === 'completed') completed.push(dto);
    else upcoming.push(dto);
  }

  return {
    bookings: {
      upcoming,
      cancelled,
      completed,
    },
  };
}

export async function fetchBookingById(
  bookingId: string,
  userId: string
): Promise<Record<string, unknown> | null> {
  let matchStage: Record<string, unknown>;
  if (bookingId.toUpperCase().startsWith('BMV-')) {
    const suffix = bookingId.toUpperCase().replace('BMV-', '').toLowerCase();
    matchStage = {
      userId: new Types.ObjectId(userId),
      $expr: {
        $eq: [{ $substr: [{ $toString: '$_id' }, 18, 6] }, suffix],
      },
    };
  } else {
    matchStage = { _id: new Types.ObjectId(bookingId), userId: new Types.ObjectId(userId) };
  }

  const [booking] = await BookingModel.aggregate<AggregatedBooking | undefined>([
    { $match: matchStage },
    {
      $lookup: {
        from: 'Venues',
        localField: 'venueId',
        foreignField: '_id',
        as: 'venue',
      },
    },
    { $unwind: '$venue' },
  ]);

  if (!booking) return null;

  const now = new Date();
  const bookingStart = new Date(`${booking.date}T00:00:00`);
  bookingStart.setMinutes(booking.startTime);
  const bookingEnd = new Date(`${booking.date}T00:00:00`);
  bookingEnd.setMinutes(booking.endTime);

  let uiStatus: string;
  if (booking.status === BookingStatus.CANCELLED) {
    uiStatus = 'cancelled';
  } else if (booking.status === BookingStatus.COMPLETED) {
    uiStatus = 'completed';
  } else if (booking.status === BookingStatus.IN_PROGRESS) {
    uiStatus = 'in_progress';
  } else if (bookingEnd < now) {
    uiStatus = 'completed';
  } else if (bookingStart <= now && bookingEnd > now) {
    uiStatus = 'in_progress';
  } else {
    uiStatus = 'upcoming';
  }

  return {
    _id: booking._id.toString(),
    bookingRef: `BMV-${booking._id.toString().slice(-6).toUpperCase()}`,
    venueName: booking.venue.name,
    venueId: booking.venue._id.toString(),
    city: booking.venue.city,
    district: booking.venue.district,
    coverImage: booking.venue.coverImage,
    date: new Date(booking.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    timeRange: `${minutesToTimeString(booking.startTime)} - ${minutesToTimeString(booking.endTime)}`,
    bookedOn: new Date(booking.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    guestCount: booking.guestCount,
    eventType: booking.eventType,
    totalPrice: booking.price,
    paymentMethod: booking.paymentMethod,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    uiStatus,
    address: booking.venue.address,
    contactPhone: booking.venue.contact.phone,
    contactEmail: booking.venue.contact.email,
    googleMapsUrl: booking.venue.googleMapsUrl,
    amenities: booking.venue.amenities,
    cancellationPolicy: booking.contractSnapshot
      ? resolveRefundPctFromSnapshot(booking.contractSnapshot.cancellation, booking.date).label
      : resolveRefundPct(booking.venue, booking.date).label,
    cancellationRefundPct: booking.contractSnapshot
      ? resolveRefundPctFromSnapshot(booking.contractSnapshot.cancellation, booking.date).pct
      : resolveRefundPct(booking.venue, booking.date).pct,
    paymentReference: booking.paymentReference,
    bookerInfo: booking.bookerInfo,
  };
}

// Conflict resolution
export async function fetchActiveConflicts(
  venueId: string,
  date: string,
  options?: {
    excludeUserId?: string;
    excludeSessionTokenHash?: string;
    session?: ClientSession;
  }
): Promise<{ start: number; end: number }[]> {
  const vId = new Types.ObjectId(venueId);

  let lockQuery: Record<string, unknown> = { venueId: vId, date };
  const excludeConditions: Record<string, unknown>[] = [];

  if (options?.excludeUserId) {
    excludeConditions.push({ userId: new Types.ObjectId(options.excludeUserId) });
  }
  if (options?.excludeSessionTokenHash) {
    excludeConditions.push({ sessionTokenHash: options.excludeSessionTokenHash });
  }

  if (excludeConditions.length > 0) {
    lockQuery = { ...lockQuery, $nor: excludeConditions };
  }

  const locks = await LockModel.find(lockQuery)
    .session(options?.session ?? null)
    .lean();
  const bookings = await BookingModel.find({
    venueId: vId,
    date,
    status: { $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.IN_PROGRESS] },
  })
    .session(options?.session ?? null)
    .lean();

  return [
    ...locks.map((l: ILock) => ({ start: l.startTime, end: l.endTime })),
    ...bookings.map((b: IBooking) => ({ start: b.startTime, end: b.endTime })),
  ];
}

export async function fetchApprovedVenueForBooking(venueId: string): Promise<IVenue | null> {
  return VenueModel.findOne({
    _id: new Types.ObjectId(venueId),
    status: 'Approved',
    active: true,
    deleted: false,
  }).lean();
}

// Booking writes
export interface CreateBookingData {
  venueId: string;
  userId: string;
  date: string;
  startTime: number;
  endTime: number;
  price: number;
  paymentReference: string;
  status?: BookingStatusType;
  paymentStatus?: PaymentStatusType;
  guestCount?: number;
  eventType?: string;
  bookerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    place?: string;
    note?: string;
  };
  paymentMethod?: string;
  advancePaid?: number;
  remainingAmount?: number;
  contractSnapshot?: IContractSnapshot;
}

export async function createBooking(data: CreateBookingData): Promise<IBooking> {
  const booking = await BookingModel.create({
    venueId: new Types.ObjectId(data.venueId),
    userId: new Types.ObjectId(data.userId),
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    price: data.price,
    paymentReference: data.paymentReference,
    status: data.status ?? BookingStatus.CONFIRMED,
    paymentStatus: data.paymentStatus ?? PaymentStatus.PAID,
    guestCount: data.guestCount,
    eventType: data.eventType,
    bookerInfo: data.bookerInfo,
    paymentMethod: data.paymentMethod,
    advancePaid: data.advancePaid,
    remainingAmount: data.remainingAmount,
    contractSnapshot: data.contractSnapshot,
  });
  return booking;
}

// FailedBooking audit
export interface CreateFailedBookingData {
  venueId: string;
  userId: string;
  date: string;
  startTime: number;
  endTime: number;
  amountPaid: number;
  paymentReference: string;
  refundReference: string;
  reason: string;
}

// Inserts an immutable audit record for a collision-triggered refund.
export async function createFailedBooking(data: CreateFailedBookingData): Promise<void> {
  await FailedBookingModel.create({
    venueId: new Types.ObjectId(data.venueId),
    userId: new Types.ObjectId(data.userId),
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    amountPaid: data.amountPaid,
    paymentReference: data.paymentReference,
    refundReference: data.refundReference,
    reason: data.reason,
  });
}

// Idempotency gate
/**
 * Inserts the Razorpay event_id into ProcessedWebhookModel.
 * Throws a MongoServerError with code 11000 if the event was already processed.
 * The caller MUST catch error.code === 11000 and return 200 immediately.
 */
export async function markWebhookProcessed(eventId: string): Promise<void> {
  await ProcessedWebhookModel.create({ eventId });
}

export async function findAllBookings(
  paginationParams: PaginationParams,
  filters?: { status?: BookingStatusType; venueId?: string }
): Promise<PaginatedResponse<AggregatedBooking, 'bookings'>> {
  const { limit, skip } = paginationParams;
  const matchStage: Record<string, unknown> = {};

  if (filters?.status) matchStage.status = filters.status;
  if (filters?.venueId) matchStage.venueId = new Types.ObjectId(filters.venueId);

  const [bookings, totalCount] = await Promise.all([
    BookingModel.aggregate<AggregatedBooking>([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
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
    ]),
    BookingModel.countDocuments(matchStage).exec(),
  ]);

  // Compute UI status for each booking
  const now = new Date();
  const bookingsWithUIStatus = bookings.map((booking) => {
    if (booking.status === 'cancelled') {
      return { ...booking, uiStatus: 'cancelled' as const };
    }
    if (booking.status === 'completed') {
      return { ...booking, uiStatus: 'completed' as const };
    }
    if (booking.status === 'in_progress') {
      return { ...booking, uiStatus: 'in_progress' as const };
    }
    const eventStart = new Date(`${booking.date}T00:00:00`);
    eventStart.setMinutes(booking.startTime);
    const eventEnd = new Date(`${booking.date}T00:00:00`);
    eventEnd.setMinutes(booking.endTime);
    if (eventEnd < now) {
      return { ...booking, uiStatus: 'completed' as const, status: 'completed' as const };
    }
    if (eventStart <= now && eventEnd > now) {
      return { ...booking, uiStatus: 'in_progress' as const, status: 'in_progress' as const };
    }
    return { ...booking, uiStatus: 'confirmed' as const };
  });

  return {
    bookings: bookingsWithUIStatus,
    pagination: buildPaginationMeta(totalCount, paginationParams),
  };
}

export async function updateLockBookerDetails(
  lockId: string,
  userId: string,
  guestCount?: number,
  eventType?: string,
  bookerInfo?: Record<string, unknown>
): Promise<ILock | null> {
  return LockModel.findOneAndUpdate(
    { _id: new Types.ObjectId(lockId), userId: new Types.ObjectId(userId) },
    {
      $set: {
        guestCount,
        eventType,
        bookerInfo,
      },
    },
    { new: true }
  ).lean();
}
export async function fetchUserBookingByRefIdOrId(
  bookingId: string,
  userId: string
): Promise<IBooking | null> {
  const isBookingRef = bookingId.toUpperCase().startsWith('BMV-') && bookingId.length === 10;
  if (isBookingRef) {
    const suffix = bookingId.toUpperCase().replace('BMV-', '');
    const userBookings = await BookingModel.find({ userId: new Types.ObjectId(userId) });
    return userBookings.find((b) => b._id.toString().slice(-6).toUpperCase() === suffix) ?? null;
  } else {
    return BookingModel.findOne({
      _id: new Types.ObjectId(bookingId),
      userId: new Types.ObjectId(userId),
    });
  }
}

export async function findLockById(lockId: string, userId: string): Promise<ILock | null> {
  return LockModel.findOne({
    _id: new Types.ObjectId(lockId),
    userId: new Types.ObjectId(userId),
  }).lean();
}

export async function findLockByIdRaw(lockId: string): Promise<ILock | null> {
  return LockModel.findById(lockId).lean();
}

export async function deleteLockById(lockId: string): Promise<void> {
  await LockModel.deleteOne({ _id: new Types.ObjectId(lockId) });
}

export async function createLock(
  data: Partial<ILock>[],
  session?: ClientSession
): Promise<ILock[]> {
  return LockModel.create(data, { session });
}

export async function deleteLocksByConditions(
  deleteConditions: Record<string, unknown>[],
  session?: ClientSession
): Promise<unknown> {
  if (deleteConditions.length > 0) {
    return LockModel.deleteMany({ $or: deleteConditions }, { session });
  }
  return null;
}

export async function fetchBookingByPaymentReference(paymentId: string): Promise<IBooking | null> {
  return BookingModel.findOne({ paymentReference: paymentId }).lean();
}

// Atomically transitions CONFIRMED -> CANCELLED. Returns the pre-update
// document if this call won the race, or null if the booking was already
// cancelled (by a concurrent request or otherwise). This is the sole gate
// that must pass before a refund is issued — it guarantees at most one
// caller can ever proceed to refund for a given booking.
export async function claimBookingForCancellation(
  bookingId: string,
  userId: string,
  reason?: string
): Promise<IBooking | null> {
  return BookingModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(bookingId),
      userId: new Types.ObjectId(userId),
      status: BookingStatus.CONFIRMED,
    },
    {
      $set: {
        status: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.REFUNDED,
        ...(reason ? { cancellationReason: reason } : {}),
      },
    },
    { new: false }
  ).lean();
}

export async function findVerifiedUserIds(
  venueId: string,
  userIds: string[]
): Promise<Set<string>> {
  const verified = await BookingModel.find({
    venueId,
    userId: { $in: userIds },
    status: { $ne: BookingStatus.CANCELLED },
  }).distinct('userId');
  return new Set(verified.map((id) => id.toString()));
}
