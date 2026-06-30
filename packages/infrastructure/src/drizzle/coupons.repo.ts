// Drizzle implementation of CouponsRepo

import { eq, and, sql, desc } from "drizzle-orm";
import type { Coupon } from "@repo/domain/coupons";
import type { CouponWithVenue, CouponsRepo } from "@repo/contracts";
import { coupons, venues } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCoupon(c: any): Coupon {
  return {
    id: c.id,
    code: c.code,
    venue_id: c.venueId ?? null,
    discount_type: c.discountType,
    discount_value: Number(c.discountValue),
    valid_from: c.validFrom,
    valid_until: c.validUntil ?? null,
    usage_limit: c.usageLimit ?? null,
    times_used: c.timesUsed,
    is_active: Boolean(c.isActive),
    created_by: c.createdBy ?? null,
  } as Coupon;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCouponWithVenue(row: any): CouponWithVenue {
  const c = row.coupon;
  const v = row.venue;
  return {
    ...mapCoupon(c),
    created_at: c.createdAt,
    venues: v ? { name: v.name } : null,
  };
}

export function makeCouponsRepo(deps: { adminDb: any; userDb?: any }): CouponsRepo {
  const { adminDb, userDb } = deps;
  const db = userDb ?? adminDb;

  return {
    async findActiveByCode(code) {
      const rows = await adminDb
        .select()
        .from(coupons)
        .where(and(eq(sql`upper(${coupons.code})`, code.toUpperCase()), eq(coupons.isActive, true)))
        .limit(1);
      return rows[0] ? mapCoupon(rows[0]) : null;
    },

    async incrementUsage(id) {
      await adminDb
        .update(coupons)
        .set({
          timesUsed: sql`${coupons.timesUsed} + 1`,
        })
        .where(eq(coupons.id, id));
    },

    async listForHostVenues(hostId) {
      const rows = await db
        .select({
          coupon: coupons,
          venue: {
            name: venues.name,
          },
        })
        .from(coupons)
        .leftJoin(venues, eq(coupons.venueId, venues.id))
        .where(eq(venues.hostId, hostId))
        .orderBy(desc(coupons.createdAt));

      return rows.map(mapCouponWithVenue);
    },

    async create(input) {
      const id = crypto.randomUUID();
      const insertData = {
        id,
        code: input.code.toUpperCase(),
        venueId: input.venue_id,
        discountType: input.discount_type,
        discountValue: input.discount_value,
        validFrom: input.valid_from ?? new Date().toISOString(),
        validUntil: input.valid_until,
        usageLimit: input.usage_limit,
        timesUsed: 0,
        isActive: input.is_active,
        createdBy: input.created_by,
      };

      await db.insert(coupons).values(insertData);

      const rows = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
      return mapCoupon(rows[0]);
    },

    async delete(id) {
      await db.delete(coupons).where(eq(coupons.id, id));
    },
  };
}
