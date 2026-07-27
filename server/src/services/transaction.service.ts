import mongoose from 'mongoose';
import { walletRepository } from '@/repositories/wallet.repository';
import { findAdminSettlements, findAllSettlements } from '@/repositories/settlement.repository';
import { AdminTransaction } from '@/dto/admin/transactions';

export const getAdminTransactions = async (options: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  sort?: string;
}) => {
  const page = options.page || 1;
  const limit = options.limit || 10;

  const walletFilter: any = {};
  if (options.type && options.type !== 'ALL') {
    if (options.type === 'Booking Payment') walletFilter.source = 'BOOKING_PAYMENT';
    else if (options.type === 'Refund') walletFilter.source = 'REFUND';
    else walletFilter.source = 'INVALID';
  }

  const settlementFilter: any = {};
  if (options.type && options.type !== 'ALL') {
    if (options.type !== 'Owner Payout') settlementFilter._id = new mongoose.Types.ObjectId('000000000000000000000000'); // skip
  }

  const [walletTxns, settlements] = await Promise.all([
    walletRepository.findAdminTransactions(walletFilter),
    findAdminSettlements(settlementFilter)
  ]);

  let allTransactions: AdminTransaction[] = [];

  walletTxns.forEach((tx: any) => {
    let typeName = tx.source;
    if (tx.source === 'BOOKING_PAYMENT') typeName = 'Booking Payment';
    if (tx.source === 'REFUND') typeName = 'Refund';

    const booking = tx.bookingId || {};
    const venue = booking.venue || {};
    const owner = venue.ownerId || {};
    const user = tx.userId || {};

    allTransactions.push({
      id: tx._id.toString(),
      date: tx.createdAt,
      type: typeName,
      bookingId: booking.bookingId || 'N/A',
      userName: user.fullName || 'Unknown',
      ownerName: owner.fullName || 'Unknown',
      venueName: venue.name || 'Unknown',
      amount: tx.amount,
      status: tx.status === 'SUCCESS' ? 'SUCCESS' : tx.status,
    });
  });

  // Map Settlements
  settlements.forEach((s: any) => {
    const booking = s.bookingId || {};
    const user = booking.user || {};
    const venue = s.venueId || {};
    const owner = s.ownerId || {};

    let status = s.status;
    if (status === 'SETTLED') status = 'SUCCESS';
    if (status === 'PROCESSING') status = 'PENDING';

    allTransactions.push({
      id: s._id.toString(),
      date: s.createdAt,
      type: 'Owner Payout',
      bookingId: booking.bookingId || 'N/A',
      userName: user.fullName || 'Unknown',
      ownerName: owner.fullName || 'Unknown',
      venueName: venue.name || 'Unknown',
      amount: s.ownerEarnings,
      status: status,
    });
  });

  if (options.search) {
    const s = options.search.toLowerCase();
    allTransactions = allTransactions.filter(t => 
      t.id.toLowerCase().includes(s) ||
      t.bookingId.toLowerCase().includes(s) ||
      t.userName.toLowerCase().includes(s) ||
      t.ownerName.toLowerCase().includes(s) ||
      t.venueName.toLowerCase().includes(s)
    );
  }

  if (options.status && options.status !== 'ALL') {
    const targetStatus = options.status.toUpperCase();
    allTransactions = allTransactions.filter(t => {
      if (targetStatus === 'SUCCESS') return t.status === 'SUCCESS' || t.status === 'SETTLED';
      if (targetStatus === 'PENDING') return t.status === 'PENDING' || t.status === 'PROCESSING';
      if (targetStatus === 'FAILED') return t.status === 'FAILED';
      return t.status.toUpperCase() === targetStatus;
    });
  }

  allTransactions.sort((a, b) => {
    if (options.sort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (options.sort === 'highest') return b.amount - a.amount;
    if (options.sort === 'lowest') return a.amount - b.amount;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const total = allTransactions.length;
  
  const skip = (page - 1) * limit;
  const paginated = allTransactions.slice(skip, skip + limit);

  return {
    data: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getAdminTransactionStats = async () => {
  const walletTxns = await walletRepository.findAllTransactions();
  const settlements = await findAllSettlements();

  let totalBookingPayments = 0;
  let totalRefundAmount = 0;
  let totalOwnerPayouts = 0;
  let pendingOwnerPayouts = 0;

  walletTxns.forEach(tx => {
    if (tx.status === 'SUCCESS') {
      if (tx.source === 'BOOKING_PAYMENT') totalBookingPayments += tx.amount;
      if (tx.source === 'REFUND') totalRefundAmount += tx.amount;
    }
  });

  settlements.forEach(s => {
    if (s.status === 'SETTLED') {
      totalOwnerPayouts += s.ownerEarnings;
    } else if (s.status === 'PENDING' || s.status === 'PROCESSING') {
      pendingOwnerPayouts += s.ownerEarnings;
    }
  });

  const totalTransactionVolume = totalBookingPayments + totalRefundAmount + totalOwnerPayouts;
  const totalTransactions = walletTxns.length + settlements.length;

  return {
    totalTransactionVolume,
    totalBookingPayments,
    totalRefundAmount,
    totalOwnerPayouts,
    pendingOwnerPayouts,
    totalTransactions
  };
};
