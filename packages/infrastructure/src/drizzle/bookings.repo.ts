// Drizzle implementation of BookingsRepo & PaymentsRepo

import { eq, and, inArray, lt, gt, desc, sql } from "drizzle-orm";
import type { Booking, BookingStatus } from "@repo/domain/bookings";
import type { Venue } from "@repo/domain/venues";
import type { BookingWithVenue, BookingsRepo, PaymentsRepo } from "@repo/contracts";
import { bookings, venues, payments } from "./schema";

/** Thrown when an atomic conditional INSERT detects an overlapping active booking. */
export class BookingOverlapError extends Error {
  constructor() {
    super("Booking overlaps with an existing active booking");
    this.name = "BookingOverlapError";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBooking(b: any): Booking {
  return {
    id: b.id,
    venue_id: b.venueId,
    customer_id: b.customerId ?? null,
    coupon_id: b.couponId ?? null,
    start_time: b.startTime,
    end_time: b.endTime,
    guest_count: b.guestCount ?? null,
    subtotal_cents: b.subtotalCents,
    discount_amount_cents: b.discountAmountCents,
    total_cents: b.totalCents,
    currency: b.currency,
    status: b.status as BookingStatus,
    expires_at: b.expiresAt ?? null,
    version: b.version,
    notes: b.notes ?? null,
    stripe_session_id: b.stripeSessionId ?? null,
    source: b.source,
    guest_name: b.guestName ?? null,
    guest_email: b.guestEmail ?? null,
    guest_phone: b.guestPhone ?? null,
    payment_method: b.paymentMethod ?? null,
    amount_paid_cents: b.amountPaidCents,
    created_at: b.createdAt,
    updated_at: b.updatedAt,
  } as Booking;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBookingRow(row: any): BookingWithVenue {
  const b = row.booking;
  const v = row.venue;
  return {
    ...mapBooking(b),
    venues: v
      ? {
          name: v.name,
          address_data:
            typeof v.addressData === "string" ? JSON.parse(v.addressData) : v.addressData,
          cover_image_url: v.coverImageUrl ?? null,
          host_id: v.hostId ?? null,
        }
      : null,
  };
}

export function makeBookingsRepo(deps: { adminDb: any; userDb?: any }): BookingsRepo {
  const { adminDb, userDb } = deps;
  const db = userDb ?? adminDb;

  return {
    async findVenuePricing(id) {
      const rows = await adminDb
        .select({
          id: venues.id,
          basePriceCents: venues.basePriceCents,
          currency: venues.currency,
          pricingMode: venues.pricingMode,
        })
        .from(venues)
        .where(eq(venues.id, id))
        .limit(1);

      if (!rows[0]) return null;
      return {
        id: rows[0].id,
        base_price_cents: rows[0].basePriceCents,
        currency: rows[0].currency,
        pricing_mode: rows[0].pricingMode,
      } as any;
    },

    async findConflicts({ venue_id, start_time, end_time }) {
      const rows = await adminDb
        .select({
          id: bookings.id,
          status: bookings.status,
          expiresAt: bookings.expiresAt,
        })
        .from(bookings)
        .where(
          and(
            eq(bookings.venueId, venue_id),
            inArray(bookings.status, ["pending", "confirmed"]),
            lt(bookings.startTime, end_time),
            gt(bookings.endTime, start_time),
          ),
        );

      return rows.map((r: any) => ({
        id: r.id,
        status: r.status as BookingStatus,
        expires_at: r.expiresAt ?? null,
      }));
    },

    async create(input) {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      // Atomic conditional INSERT: the conflict check and insert happen in
      // one SQL statement, so SQLite's write lock prevents concurrent races.
      const result = await db.run(sql`
        INSERT INTO bookings (
          id, venue_id, customer_id, coupon_id,
          start_time, end_time, guest_count,
          subtotal_cents, discount_amount_cents, total_cents,
          currency, status, expires_at, version,
          notes, stripe_session_id, source,
          guest_name, guest_email, guest_phone,
          payment_method, amount_paid_cents,
          created_at, updated_at
        )
        SELECT
          ${id}, ${input.venue_id}, ${input.customer_id ?? null}, ${input.coupon_id ?? null},
          ${input.start_time}, ${input.end_time}, ${input.guest_count ?? null},
          ${input.subtotal_cents}, ${input.discount_amount_cents}, ${input.total_cents},
          ${input.currency}, ${input.status}, ${input.expires_at ?? null}, 1,
          ${input.notes ?? null}, ${(input as any).stripe_session_id ?? null}, ${input.source},
          ${input.guest_name ?? null}, ${input.guest_email ?? null}, ${input.guest_phone ?? null},
          ${input.payment_method ?? null}, ${input.amount_paid_cents},
          ${now}, ${now}
        WHERE NOT EXISTS (
          SELECT 1 FROM bookings
          WHERE venue_id = ${input.venue_id}
            AND start_time < ${input.end_time}
            AND end_time   > ${input.start_time}
            AND (
                  status = 'confirmed'
               OR (status = 'pending' AND expires_at > ${now})
            )
        )
      `);

      if (!result.meta.changes) {
        throw new BookingOverlapError();
      }

      const rows = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
      return mapBooking(rows[0]);
    },

    async findById(id) {
      const rows = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
      return rows[0] ? mapBooking(rows[0]) : null;
    },

    async updateStatus({ id, version, status, expires_at }) {
      await db
        .update(bookings)
        .set({
          status,
          expiresAt: expires_at,
          version: version + 1,
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(bookings.id, id), eq(bookings.version, version)));

      const rows = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
      if (!rows[0]) throw new Error("Booking not found or version mismatch");
      return mapBooking(rows[0]);
    },

    async setStatus(id, status) {
      await db
        .update(bookings)
        .set({
          status,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(bookings.id, id));
    },

    async listForCustomer(customerId) {
      const rows = await db
        .select({
          booking: bookings,
          venue: {
            name: venues.name,
            addressData: venues.addressData,
            coverImageUrl: venues.coverImageUrl,
            hostId: venues.hostId,
          },
        })
        .from(bookings)
        .leftJoin(venues, eq(bookings.venueId, venues.id))
        .where(eq(bookings.customerId, customerId))
        .orderBy(desc(bookings.startTime));

      return rows.map(mapBookingRow);
    },

    async listForHost(hostId) {
      const rows = await db
        .select({
          booking: bookings,
          venue: {
            name: venues.name,
            addressData: venues.addressData,
            coverImageUrl: venues.coverImageUrl,
            hostId: venues.hostId,
          },
        })
        .from(bookings)
        .leftJoin(venues, eq(bookings.venueId, venues.id))
        .where(eq(venues.hostId, hostId))
        .orderBy(desc(bookings.startTime));

      return rows.map(mapBookingRow);
    },

    async findWithVenue(id) {
      const rows = await db
        .select({
          booking: bookings,
          venue: {
            name: venues.name,
            addressData: venues.addressData,
            coverImageUrl: venues.coverImageUrl,
            hostId: venues.hostId,
          },
        })
        .from(bookings)
        .leftJoin(venues, eq(bookings.venueId, venues.id))
        .where(eq(bookings.id, id))
        .limit(1);

      return rows[0] ? mapBookingRow(rows[0]) : null;
    },
  };
}

export function makePaymentsRepo(deps: { adminDb: any }): PaymentsRepo {
  return {
    async recordSuccess({ booking_id, amount_cents, currency, transaction_id }) {
      const id = crypto.randomUUID();
      await deps.adminDb.insert(payments).values({
        id,
        bookingId: booking_id,
        gateway: "stripe",
        transactionId: transaction_id,
        amountCents: amount_cents,
        currency,
        status: "success",
        gatewayResponse: JSON.stringify({ simulated: true }),
      });
    },
  };
}
