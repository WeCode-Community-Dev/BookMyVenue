// Drizzle implementation of AdminRepo

import {
  eq,
  and,
  or,
  like,
  inArray,
  lt,
  gt,
  desc,
  sql,
  count,
  sum,
  isNotNull,
  notExists,
} from "drizzle-orm";
import type {
  AdminBookingFilter,
  AdminBookingListItem,
  AdminCouponListItem,
  AdminRepo,
  AdminReviewListItem,
  AdminUserDetail,
  AdminUserListItem,
  AdminVenueListItem,
  AppRole,
  PlatformStats,
} from "@repo/contracts";
import type { BookingStatus } from "@repo/domain/bookings";
import {
  profiles,
  userRoles,
  bookings,
  venues,
  payments,
  venueReviews,
  coupons,
  invoices,
} from "./schema";

export function makeAdminRepo(deps: { adminDb: any }): AdminRepo {
  const db = deps.adminDb;

  return {
    async platformStats(): Promise<PlatformStats> {
      const [
        usersTotal,
        usersSuspended,
        usersNew30d,
        hostsTotal,
        adminsTotal,
        venuesTotal,
        venuesActive,
        venuesSuspended,
        bookingsTotal,
        bookings30d,
        bookingsPendingExpired,
        revenueTotal,
        revenue30d,
        bookingsByStatusRows,
        confirmedWithoutPayment,
        bookingsTrend,
      ] = await Promise.all([
        db.select({ val: count() }).from(profiles),
        db.select({ val: count() }).from(profiles).where(eq(profiles.isSuspended, true)),
        db
          .select({ val: count() })
          .from(profiles)
          .where(gt(profiles.created_at, sql`datetime('now', '-30 days')`)),
        db.select({ val: count() }).from(userRoles).where(eq(userRoles.role, "host")),
        db.select({ val: count() }).from(userRoles).where(eq(userRoles.role, "admin")),
        db.select({ val: count() }).from(venues),
        db
          .select({ val: count() })
          .from(venues)
          .where(and(eq(venues.isActive, true), eq(venues.isSuspended, false))),
        db.select({ val: count() }).from(venues).where(eq(venues.isSuspended, true)),
        db.select({ val: count() }).from(bookings),
        db
          .select({ val: count() })
          .from(bookings)
          .where(gt(bookings.createdAt, sql`datetime('now', '-30 days')`)),
        db
          .select({ val: count() })
          .from(bookings)
          .where(
            and(
              eq(bookings.status, "pending"),
              isNotNull(bookings.expiresAt),
              lt(bookings.expiresAt, new Date().toISOString()),
            ),
          ),
        db
          .select({ val: sum(payments.amountCents) })
          .from(payments)
          .where(eq(payments.status, "success")),
        db
          .select({ val: sum(payments.amountCents) })
          .from(payments)
          .where(
            and(
              eq(payments.status, "success"),
              gt(payments.createdAt, sql`datetime('now', '-30 days')`),
            ),
          ),
        db
          .select({ status: bookings.status, val: count() })
          .from(bookings)
          .groupBy(bookings.status),
        db
          .select({ val: count() })
          .from(bookings)
          .where(
            and(
              eq(bookings.status, "confirmed"),
              eq(bookings.source, "online"),
              notExists(
                db
                  .select()
                  .from(payments)
                  .where(and(eq(payments.bookingId, bookings.id), eq(payments.status, "success"))),
              ),
            ),
          ),
        db
          .select({
            day: sql<string>`date(${bookings.createdAt})`,
            count: count(),
          })
          .from(bookings)
          .where(gt(bookings.createdAt, sql`datetime('now', '-30 days')`))
          .groupBy(sql`date(${bookings.createdAt})`)
          .orderBy(sql`date(${bookings.createdAt})`),
      ]);

      const statusMap: Record<string, number> = {};
      bookingsByStatusRows.forEach((r: any) => {
        statusMap[r.status] = r.val;
      });

      return {
        users_total: usersTotal[0]?.val ?? 0,
        users_suspended: usersSuspended[0]?.val ?? 0,
        users_new_30d: usersNew30d[0]?.val ?? 0,
        hosts_total: hostsTotal[0]?.val ?? 0,
        admins_total: adminsTotal[0]?.val ?? 0,
        venues_total: venuesTotal[0]?.val ?? 0,
        venues_active: venuesActive[0]?.val ?? 0,
        venues_suspended: venuesSuspended[0]?.val ?? 0,
        bookings_total: bookingsTotal[0]?.val ?? 0,
        bookings_by_status: statusMap,
        bookings_30d: bookings30d[0]?.val ?? 0,
        bookings_pending_expired: bookingsPendingExpired[0]?.val ?? 0,
        revenue_cents_total: Number(revenueTotal[0]?.val ?? 0),
        revenue_cents_30d: Number(revenue30d[0]?.val ?? 0),
        confirmed_without_payment: confirmedWithoutPayment[0]?.val ?? 0,
        bookings_trend_30d: bookingsTrend.map((t: any) => ({
          day: t.day,
          count: t.count,
        })),
      };
    },

    async listUsers(filter) {
      let q = db.select().from(profiles).orderBy(desc(profiles.created_at)).limit(500);

      if (filter.search) {
        const searchPattern = `%${filter.search.toLowerCase()}%`;
        q = q.where(
          or(
            like(sql`lower(${profiles.email})`, searchPattern),
            like(sql`lower(${profiles.firstName})`, searchPattern),
            like(sql`lower(${profiles.lastName})`, searchPattern),
          ),
        ) as any;
      }

      const rows = await q;
      const ids = rows.map((r: any) => r.id);

      let rolesRows: any[] = [];
      if (ids.length > 0) {
        rolesRows = await db.select().from(userRoles).where(inArray(userRoles.userId, ids));
      }

      const rolesByUser = new Map<string, AppRole[]>();
      rolesRows.forEach((r: any) => {
        const arr = rolesByUser.get(r.userId) ?? [];
        arr.push(r.role as AppRole);
        rolesByUser.set(r.userId, arr);
      });

      let result: AdminUserListItem[] = rows.map((r: any) => ({
        id: r.id,
        email: r.email,
        first_name: r.firstName ?? null,
        last_name: r.lastName ?? null,
        is_suspended: Boolean(r.isSuspended),
        created_at: r.created_at,
        roles: rolesByUser.get(r.id) ?? [],
      }));

      if (filter.role) {
        result = result.filter((r) => r.roles.includes(filter.role!));
      }

      return result;
    },

    async getUserDetail(userId): Promise<AdminUserDetail> {
      const [profileRows, rolesRows, bookingsRows, venuesRows, reviewsRows] = await Promise.all([
        db.select().from(profiles).where(eq(profiles.id, userId)).limit(1),
        db.select().from(userRoles).where(eq(userRoles.userId, userId)),
        db
          .select({
            booking: bookings,
            venue: { name: venues.name },
          })
          .from(bookings)
          .leftJoin(venues, eq(bookings.venueId, venues.id))
          .where(eq(bookings.customerId, userId))
          .orderBy(desc(bookings.createdAt))
          .limit(50),
        db.select().from(venues).where(eq(venues.hostId, userId)).orderBy(desc(venues.createdAt)),
        db
          .select({
            review: venueReviews,
            venue: { name: venues.name },
          })
          .from(venueReviews)
          .leftJoin(venues, eq(venueReviews.venueId, venues.id))
          .where(eq(venueReviews.userId, userId))
          .orderBy(desc(venueReviews.createdAt)),
      ]);

      const profile = profileRows[0]
        ? {
            id: profileRows[0].id,
            email: profileRows[0].email,
            first_name: profileRows[0].firstName ?? null,
            last_name: profileRows[0].lastName ?? null,
            is_suspended: Boolean(profileRows[0].isSuspended),
            created_at: profileRows[0].created_at,
          }
        : null;

      return {
        profile,
        roles: rolesRows.map((r: any) => r.role as AppRole),
        bookings: bookingsRows.map((r: any) => ({
          id: r.booking.id,
          venue_id: r.booking.venueId,
          start_time: r.booking.startTime,
          total_cents: r.booking.totalCents,
          currency: r.booking.currency,
          status: r.booking.status,
          created_at: r.booking.createdAt,
          venues: r.venue ? { name: r.venue.name } : null,
        })),
        venues: venuesRows.map((r: any) => ({
          id: r.id,
          name: r.name,
          is_active: Boolean(r.isActive),
          is_suspended: Boolean(r.isSuspended),
          created_at: r.createdAt,
        })),
        reviews: reviewsRows.map((r: any) => ({
          id: r.review.id,
          venue_id: r.review.venueId,
          rating: r.review.rating,
          feedback: r.review.feedback ?? null,
          created_at: r.review.createdAt,
          venues: r.venue ? { name: r.venue.name } : null,
        })),
      };
    },

    async setUserSuspended(userId, suspended) {
      await db
        .update(profiles)
        .set({
          isSuspended: suspended,
          updated_at: new Date().toISOString(),
        })
        .where(eq(profiles.id, userId));
    },

    async listVenues(filter) {
      let q = db
        .select({
          venue: venues,
          host: {
            id: profiles.id,
            email: profiles.email,
            firstName: profiles.firstName,
            lastName: profiles.lastName,
          },
        })
        .from(venues)
        .leftJoin(profiles, eq(venues.hostId, profiles.id))
        .orderBy(desc(venues.createdAt))
        .limit(500);

      if (filter.search) {
        const searchPattern = `%${filter.search.toLowerCase()}%`;
        q = q.where(like(sql`lower(${venues.name})`, searchPattern)) as any;
      }

      if (filter.status === "active") {
        q = q.where(and(eq(venues.isActive, true), eq(venues.isSuspended, false))) as any;
      } else if (filter.status === "inactive") {
        q = q.where(eq(venues.isActive, false)) as any;
      } else if (filter.status === "suspended") {
        q = q.where(eq(venues.isSuspended, true)) as any;
      }

      const rows = await q;

      return rows.map((r: any) => ({
        id: r.venue.id,
        host_id: r.venue.hostId,
        name: r.venue.name,
        venue_type: r.venue.venueType,
        capacity: r.venue.capacity,
        base_price_cents: r.venue.basePriceCents,
        currency: r.venue.currency,
        pricing_mode: r.venue.pricingMode,
        is_active: Boolean(r.venue.isActive),
        is_suspended: Boolean(r.venue.isSuspended),
        created_at: r.venue.createdAt,
        address_data:
          typeof r.venue.addressData === "string"
            ? JSON.parse(r.venue.addressData)
            : r.venue.addressData,
        cover_image_url: r.venue.coverImageUrl ?? null,
        host: r.host
          ? {
              id: r.host.id,
              email: r.host.email,
              first_name: r.host.firstName ?? null,
              last_name: r.host.lastName ?? null,
            }
          : null,
      }));
    },

    async setVenueSuspended(venueId, suspended) {
      await db
        .update(venues)
        .set({
          isSuspended: suspended,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(venues.id, venueId));
    },

    async listBookings(filter) {
      let q = db
        .select({
          booking: bookings,
          venue: {
            name: venues.name,
            hostId: venues.hostId,
          },
          customer: {
            id: profiles.id,
            email: profiles.email,
            firstName: profiles.firstName,
            lastName: profiles.lastName,
          },
        })
        .from(bookings)
        .leftJoin(venues, eq(bookings.venueId, venues.id))
        .leftJoin(profiles, eq(bookings.customerId, profiles.id))
        .orderBy(desc(bookings.createdAt))
        .limit(500);

      if (filter.status) {
        q = q.where(eq(bookings.status, filter.status)) as any;
      }

      if (filter.discrepancy === "stuck_pending") {
        q = q.where(
          and(eq(bookings.status, "pending"), lt(bookings.expiresAt, new Date().toISOString())),
        ) as any;
      }

      const rows = await q;
      const bookingIds = rows.map((r: any) => r.booking.id);

      let paymentRows: any[] = [];
      if (bookingIds.length > 0) {
        paymentRows = await db
          .select({
            id: payments.id,
            bookingId: payments.bookingId,
            status: payments.status,
            amountCents: payments.amountCents,
          })
          .from(payments)
          .where(inArray(payments.bookingId, bookingIds));
      }

      const paymentsByBooking = new Map<string, any[]>();
      paymentRows.forEach((p: any) => {
        const arr = paymentsByBooking.get(p.bookingId) ?? [];
        arr.push({
          id: p.id,
          status: p.status,
          amount_cents: p.amountCents,
        });
        paymentsByBooking.set(p.bookingId, arr);
      });

      let result: AdminBookingListItem[] = rows.map((r: any) => ({
        id: r.booking.id,
        venue_id: r.booking.venueId,
        customer_id: r.booking.customerId ?? null,
        start_time: r.booking.startTime,
        end_time: r.booking.endTime,
        total_cents: r.booking.totalCents,
        currency: r.booking.currency,
        status: r.booking.status as BookingStatus,
        source: r.booking.source,
        guest_email: r.booking.guestEmail ?? null,
        guest_name: r.booking.guestName ?? null,
        expires_at: r.booking.expiresAt ?? null,
        created_at: r.booking.createdAt,
        notes: r.booking.notes ?? null,
        venues: r.venue ? { name: r.venue.name, host_id: r.venue.hostId ?? null } : null,
        payments: paymentsByBooking.get(r.booking.id) ?? [],
        customer: r.customer
          ? {
              id: r.customer.id,
              email: r.customer.email,
              first_name: r.customer.firstName ?? null,
              last_name: r.customer.lastName ?? null,
            }
          : null,
      }));

      if (filter.discrepancy === "confirmed_unpaid") {
        result = result.filter(
          (b) =>
            b.status === "confirmed" &&
            b.source === "online" &&
            !(b.payments ?? []).some((p) => p.status === "success" || p.status === "succeeded"),
        );
      }

      if (filter.search) {
        const s = filter.search.toLowerCase();
        result = result.filter(
          (b) =>
            (b.guest_email ?? "").toLowerCase().includes(s) ||
            (b.customer?.email ?? "").toLowerCase().includes(s) ||
            (b.venues?.name ?? "").toLowerCase().includes(s),
        );
      }

      return result;
    },

    async updateBookingStatus({ id, status, notes }) {
      const updateData: any = { status };
      if (notes !== undefined) updateData.notes = notes;
      updateData.updatedAt = new Date().toISOString();

      await db.update(bookings).set(updateData).where(eq(bookings.id, id));
    },

    async expireStuckBookings(nowIso) {
      const affected = await db
        .select({ id: bookings.id })
        .from(bookings)
        .where(and(eq(bookings.status, "pending"), lt(bookings.expiresAt, nowIso)));

      if (affected.length === 0) return 0;

      await db
        .update(bookings)
        .set({
          status: "expired",
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(bookings.status, "pending"), lt(bookings.expiresAt, nowIso)));

      return affected.length;
    },

    async listCoupons() {
      const rows = await db
        .select({
          coupon: coupons,
          venue: { name: venues.name },
        })
        .from(coupons)
        .leftJoin(venues, eq(coupons.venueId, venues.id))
        .orderBy(desc(coupons.createdAt))
        .limit(500);

      return rows.map((r: any) => ({
        id: r.coupon.id,
        code: r.coupon.code,
        venue_id: r.coupon.venueId ?? null,
        discount_type: r.coupon.discountType,
        discount_value: Number(r.coupon.discountValue),
        valid_from: r.coupon.validFrom,
        valid_until: r.coupon.validUntil ?? null,
        usage_limit: r.coupon.usageLimit ?? null,
        times_used: r.coupon.timesUsed,
        is_active: Boolean(r.coupon.isActive),
        created_by: r.coupon.createdBy ?? null,
        created_at: r.coupon.createdAt,
        venues: r.venue ? { name: r.venue.name } : null,
      })) as AdminCouponListItem[];
    },

    async setCouponActive(id, active) {
      await db
        .update(coupons)
        .set({
          isActive: active,
        })
        .where(eq(coupons.id, id));
    },

    async listReviews() {
      const rows = await db
        .select({
          review: venueReviews,
          venue: { name: venues.name },
          user: {
            id: profiles.id,
            email: profiles.email,
            firstName: profiles.firstName,
            lastName: profiles.lastName,
          },
        })
        .from(venueReviews)
        .leftJoin(venues, eq(venueReviews.venueId, venues.id))
        .leftJoin(profiles, eq(venueReviews.userId, profiles.id))
        .orderBy(desc(venueReviews.createdAt))
        .limit(500);

      return rows.map((r: any) => ({
        id: r.review.id,
        user_id: r.review.userId,
        venue_id: r.review.venueId,
        rating: r.review.rating,
        feedback: r.review.feedback ?? null,
        created_at: r.review.createdAt,
        venues: r.venue ? { name: r.venue.name } : null,
        user: r.user
          ? {
              id: r.user.id,
              email: r.user.email,
              first_name: r.user.firstName ?? null,
              last_name: r.user.lastName ?? null,
            }
          : null,
      }));
    },
  };
}
