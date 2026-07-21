import { db } from '../db/index.js';
import { venuesTable } from '../models/venueModel.js';
import { usersTable } from '../models/userModel.js';
import { bookingsTable } from '../models/bookingModel.js';
import { paymentsTable } from '../models/paymentModel.js';
import { eq, sql, count } from 'drizzle-orm';

const analyticServices = {
  adminDashboardStats: async () => {
    const [venueCount] = await db
      .select({ count: count() })
      .from(venuesTable);

    const [userCount] = await db
      .select({ count: count() })
      .from(usersTable);

    const [bookingCount] = await db
      .select({ count: count() })
      .from(bookingsTable);

    const [pendingVenueCount] = await db
      .select({ count: count() })
      .from(venuesTable)
      .where(eq(venuesTable.approvalStatus, 'pending'));

    const [approvedVenueCount] = await db
      .select({ count: count() })
      .from(venuesTable)
      .where(eq(venuesTable.approvalStatus, 'approved'));

    const [rejectedVenueCount] = await db
      .select({ count: count() })
      .from(venuesTable)
      .where(eq(venuesTable.approvalStatus, 'rejected'));

    const [activeVenueCount] = await db
      .select({ count: count() })
      .from(venuesTable)
      .where(eq(venuesTable.isActive, true));

    const [approvedBookingCount] = await db
      .select({ count: count() })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, 'approved'));

    const [pendingBookingCount] = await db
      .select({ count: count() })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, 'pending'));

    const [cancelledBookingCount] = await db
      .select({ count: count() })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, 'cancelled'));

    const [rejectedBookingCount] = await db
      .select({ count: count() })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, 'rejected'));

    const [completedBookingCount] = await db
      .select({ count: count() })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, 'completed'));

    const [revenueResult] = await db
      .select({
        totalRevenue: sql`COALESCE(SUM(${paymentsTable.amount}), 0)`,
      })
      .from(paymentsTable)
      .where(eq(paymentsTable.status, 'completed'));

    return {
      totalVenues: Number(venueCount.count),
      totalUsers: Number(userCount.count),
      totalBookings: Number(bookingCount.count),
      totalPendingApprovals: Number(pendingVenueCount.count),
      totalApprovedVenues: Number(approvedVenueCount.count),
      totalRejectedVenues: Number(rejectedVenueCount.count),
      totalActiveVenues: Number(activeVenueCount.count),
      totalApprovedBookings: Number(approvedBookingCount.count),
      totalPendingBookings: Number(pendingBookingCount.count),
      totalCancelledBookings: Number(cancelledBookingCount.count),
      totalRejectedBookings: Number(rejectedBookingCount.count),
      totalCompletedBookings: Number(completedBookingCount.count),
      totalRevenue: Number(revenueResult.totalRevenue),
    };
  },
};

export default analyticServices;
