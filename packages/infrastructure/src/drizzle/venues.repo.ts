// Drizzle implementation of VenuesRepo & UserRolesRepo

import { eq, and, like, gte, lte, sql, desc } from "drizzle-orm";
import type { Venue, VenueAddress } from "@repo/domain/venues";
import type {
  AppRole,
  UserRolesRepo,
  VenueListItem,
  VenueWriteInput,
  VenuesRepo,
} from "@repo/contracts";
import { venues, userRoles } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVenue(row: any): Venue {
  return {
    id: row.id,
    host_id: row.hostId,
    name: row.name,
    description: row.description ?? null,
    venue_type: row.venueType,
    capacity: row.capacity,
    base_price_cents: row.basePriceCents,
    currency: row.currency,
    address_data:
      typeof row.addressData === "string" ? JSON.parse(row.addressData) : row.addressData,
    amenities: typeof row.amenities === "string" ? JSON.parse(row.amenities) : row.amenities,
    cover_image_url: row.coverImageUrl ?? null,
    gallery_urls:
      typeof row.galleryUrls === "string" ? JSON.parse(row.galleryUrls) : row.galleryUrls,
    is_active: Boolean(row.isActive),
    is_suspended: Boolean(row.isSuspended),
    pricing_mode: row.pricingMode,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  } as Venue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVenueListItem(row: any): VenueListItem {
  return {
    id: row.id,
    name: row.name,
    venue_type: row.venueType,
    capacity: row.capacity,
    base_price_cents: row.basePriceCents,
    currency: row.currency,
    pricing_mode: row.pricingMode,
    address_data:
      typeof row.addressData === "string" ? JSON.parse(row.addressData) : row.addressData,
    cover_image_url: row.coverImageUrl ?? null,
    description: row.description ?? null,
  };
}

export function makeVenuesRepo(deps: { adminDb: any; userDb?: any }): VenuesRepo {
  const { adminDb, userDb } = deps;
  const db = userDb ?? adminDb;

  return {
    async listActive(filter) {
      const conditions = [eq(venues.isActive, true), eq(venues.isSuspended, false)];

      if (filter.search) {
        conditions.push(like(sql`lower(${venues.name})`, `%${filter.search.toLowerCase()}%`));
      }
      if (filter.venue_type) {
        conditions.push(eq(venues.venueType, filter.venue_type));
      }
      if (filter.min_capacity) {
        conditions.push(gte(venues.capacity, filter.min_capacity));
      }
      if (filter.max_capacity) {
        conditions.push(lte(venues.capacity, filter.max_capacity));
      }
      if (filter.min_price_cents !== undefined) {
        conditions.push(gte(venues.basePriceCents, filter.min_price_cents));
      }
      if (filter.max_price_cents !== undefined) {
        conditions.push(lte(venues.basePriceCents, filter.max_price_cents));
      }
      if (filter.pricing_mode) {
        conditions.push(eq(venues.pricingMode, filter.pricing_mode));
      }
      if (filter.city) {
        conditions.push(
          like(
            sql`lower(json_extract(${venues.addressData}, '$.city'))`,
            `%${filter.city.toLowerCase()}%`,
          ),
        );
      }

      const rows = await adminDb
        .select()
        .from(venues)
        .where(and(...conditions))
        .orderBy(desc(venues.createdAt))
        .limit(60);

      return rows.map(mapVenueListItem);
    },

    async findById(id) {
      const rows = await adminDb.select().from(venues).where(eq(venues.id, id)).limit(1);
      return rows[0] ? mapVenue(rows[0]) : null;
    },

    async listByHost(hostId) {
      const rows = await db
        .select()
        .from(venues)
        .where(eq(venues.hostId, hostId))
        .orderBy(desc(venues.createdAt));
      return rows.map(mapVenue);
    },

    async create(input) {
      const id = crypto.randomUUID();
      const insertData = {
        id,
        hostId: input.host_id,
        name: input.name,
        description: input.description,
        venueType: input.venue_type,
        capacity: input.capacity,
        basePriceCents: input.base_price_cents,
        currency: input.currency,
        addressData: JSON.stringify(input.address_data),
        amenities: JSON.stringify(input.amenities),
        coverImageUrl: input.cover_image_url,
        galleryUrls: JSON.stringify(input.gallery_urls),
        pricingMode: input.pricing_mode,
        isActive: input.is_active,
        isSuspended: false,
      };

      await db.insert(venues).values(insertData);

      const rows = await db.select().from(venues).where(eq(venues.id, id)).limit(1);
      return mapVenue(rows[0]);
    },

    async update(id, patch) {
      const updateData: any = {};
      if (patch.name !== undefined) updateData.name = patch.name;
      if (patch.description !== undefined) updateData.description = patch.description;
      if (patch.venue_type !== undefined) updateData.venueType = patch.venue_type;
      if (patch.capacity !== undefined) updateData.capacity = patch.capacity;
      if (patch.base_price_cents !== undefined) updateData.basePriceCents = patch.base_price_cents;
      if (patch.currency !== undefined) updateData.currency = patch.currency;
      if (patch.address_data !== undefined)
        updateData.addressData = JSON.stringify(patch.address_data);
      if (patch.amenities !== undefined) updateData.amenities = JSON.stringify(patch.amenities);
      if (patch.cover_image_url !== undefined) updateData.coverImageUrl = patch.cover_image_url;
      if (patch.gallery_urls !== undefined)
        updateData.galleryUrls = JSON.stringify(patch.gallery_urls);
      if (patch.pricing_mode !== undefined) updateData.pricingMode = patch.pricing_mode;
      if (patch.is_active !== undefined) updateData.isActive = patch.is_active;

      updateData.updatedAt = new Date().toISOString();

      await db.update(venues).set(updateData).where(eq(venues.id, id));

      const rows = await db.select().from(venues).where(eq(venues.id, id)).limit(1);
      return mapVenue(rows[0]);
    },

    async delete(id) {
      await db.delete(venues).where(eq(venues.id, id));
    },
  };
}

export function makeUserRolesRepo(deps: {
  adminDb: any;
  userDb?: any;
  userId?: string;
}): UserRolesRepo {
  const { adminDb, userDb, userId } = deps;
  const db = userDb ?? adminDb;

  return {
    async promoteSelfToHost() {
      if (!userId) throw new Error("No authenticated user context");
      const id = crypto.randomUUID();
      await db
        .insert(userRoles)
        .values({
          id,
          userId,
          role: "host",
        })
        .onConflictDoNothing();
    },

    async isAdmin(uId) {
      const rows = await adminDb
        .select()
        .from(userRoles)
        .where(and(eq(userRoles.userId, uId), eq(userRoles.role, "admin")))
        .limit(1);
      return rows.length > 0;
    },

    async grant(uId, role) {
      const id = crypto.randomUUID();
      await adminDb
        .insert(userRoles)
        .values({
          id,
          userId: uId,
          role,
        })
        .onConflictDoNothing();
    },

    async revoke(uId, role) {
      await adminDb
        .delete(userRoles)
        .where(and(eq(userRoles.userId, uId), eq(userRoles.role, role)));
    },

    async listForUser(uId) {
      const rows = await adminDb
        .select({ role: userRoles.role })
        .from(userRoles)
        .where(eq(userRoles.userId, uId));
      return rows.map((r: { role: string }) => r.role as AppRole);
    },
  };
}
