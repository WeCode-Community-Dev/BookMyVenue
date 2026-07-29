import Settlement, { ISettlement } from '@/models/settlement.model';
import Booking from '@/models/booking.model';
import { BookingStatus, PaymentStatus } from '@/constants/booking';
import { SettlementStatus } from '@/constants/settlement';
import mongoose, { ClientSession } from 'mongoose';

// ── Create ──────────────────────────────────────────────────

export const createSettlement = async (
  data: Partial<ISettlement>,
  session?: ClientSession
): Promise<ISettlement> => {
  const [doc] = await Settlement.create([data], { session });
  return doc;
};

// ── Read ────────────────────────────────────────────────────

export const findSettlementByBookingId = async (
  bookingId: string
): Promise<ISettlement | null> => {
  return Settlement.findOne({ bookingId });
};

/**
 * Finds all bookings eligible for settlement (admin view).
 * Eligible = COMPLETED + PAID + settlementStatus is PENDING.
 */
export const findPendingSettlements = async (page: number, limit: number) => {
  const filter = {
    bookingStatus: BookingStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    settlementStatus: SettlementStatus.PENDING,
  };
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate({ path: 'venue', select: 'name address images ownerId' })
      .populate({ path: 'user', select: 'fullName email' })
      .sort({ updatedAt: 1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Fetches settlement history for a specific owner.
 */
export const findSettlementsByOwner = async (
  ownerId: string,
  page: number,
  limit: number
) => {
  const filter = { ownerId: new mongoose.Types.ObjectId(ownerId) };
  const skip = (page - 1) * limit;

  const [settlements, total] = await Promise.all([
    Settlement.find(filter)
      .populate('bookingId', 'bookingId startDateTime endDateTime totalAmount')
      .populate('venueId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Settlement.countDocuments(filter),
  ]);

  return {
    settlements,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// ── Update ──────────────────────────────────────────────────

export const updateSettlementStatus = async (
  id: string,
  status: SettlementStatus,
  session?: ClientSession
): Promise<ISettlement | null> => {
  const updates: Record<string, any> = { status };
  if (status === SettlementStatus.SETTLED) {
    updates.settledAt = new Date();
  }
  return Settlement.findByIdAndUpdate(id, updates, { new: true, session });
};

// ── Aggregations ────────────────────────────────────────────

export const getOwnerRevenueStats = async (ownerId: string) => {
  const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

  const [settledStats] = await Settlement.aggregate([
    { $match: { ownerId: ownerObjectId, status: SettlementStatus.SETTLED } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$ownerEarnings' },
        totalPlatformFee: { $sum: '$platformFee' },
        settledCount: { $sum: 1 },
      },
    },
  ]);

  const pendingCount = await Settlement.countDocuments({
    ownerId: ownerObjectId,
    status: SettlementStatus.PENDING,
  });

  const [pendingStats] = await Settlement.aggregate([
    { $match: { ownerId: ownerObjectId, status: SettlementStatus.PENDING } },
    { $group: { _id: null, pendingAmount: { $sum: '$ownerEarnings' } } },
  ]);

  return {
    totalRevenue: settledStats?.totalRevenue || 0,
    totalPlatformFee: settledStats?.totalPlatformFee || 0,
    settledCount: settledStats?.settledCount || 0,
    pendingCount,
    pendingAmount: pendingStats?.pendingAmount || 0,
  };
};

export const findAdminSettlements = async (filter: any): Promise<ISettlement[]> => {
  return Settlement.find(filter)
    .populate({
      path: 'bookingId',
      select: 'bookingId user',
      populate: { path: 'user', select: 'fullName' }
    })
    .populate('venueId', 'name')
    .populate('ownerId', 'fullName')
    .sort({ createdAt: -1 });
};

export const findAllSettlements = async (): Promise<ISettlement[]> => {
  return Settlement.find();
};
