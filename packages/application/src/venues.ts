// Application layer — Venues use-cases & schemas

import { z } from "zod";
import type { Venue, VenueListFilter } from "@repo/domain/venues";
import type {
  CacheStore,
  UserRolesRepo,
  VenueListItem,
  VenueWriteInput,
  VenuesRepo,
} from "@repo/contracts";

export const VenueTypeEnum = z.enum(["wedding", "conference", "party", "celebration", "other"]);
export const PricingModeEnum = z.enum(["per_hour", "per_day", "flat", "per_person"]);

export const VenueAddressSchema = z.object({
  address_line1: z.string().max(200).optional().default(""),
  address_line2: z.string().max(200).optional().default(""),
  landmark: z.string().max(200).optional().default(""),
  city: z.string().min(1).max(120),
  state: z.string().max(120).optional().default(""),
  pincode: z.string().max(20).optional().default(""),
  country: z.string().min(1).max(120),
  gstin: z.string().max(20).optional().default(""),
  contact_phone: z.string().max(30).optional().default(""),
  contact_email: z.string().max(160).optional().default(""),
  rules: z.string().max(2000).optional().default(""),
  cancellation_policy: z.string().max(2000).optional().default(""),
  min_booking_hours: z.number().int().min(1).max(72).optional().default(1),
  disabled_from: z.string().max(5).optional(),
  disabled_to: z.string().max(5).optional(),
});

export const VenueInputSchema = z.object({
  name: z.string().min(2).max(160),
  description: z.string().max(4000).optional().default(""),
  venue_type: VenueTypeEnum,
  capacity: z.number().int().min(1).max(100000),
  base_price_cents: z.number().int().min(0).max(100_000_000),
  currency: z.string().length(3).default("USD"),
  pricing_mode: PricingModeEnum.default("per_hour"),
  address_data: VenueAddressSchema,
  amenities: z.array(z.string().min(1).max(60)).max(40).default([]),
  cover_image_url: z.string().optional().nullable(),
  gallery_urls: z.array(z.string()).max(20).default([]),
  is_active: z.boolean().default(true),
});

export const VenueListFilterSchema = z.object({
  search: z.string().max(200).optional(),
  venue_type: VenueTypeEnum.optional(),
  min_capacity: z.number().int().min(0).optional(),
  max_capacity: z.number().int().min(0).optional(),
  min_price_cents: z.number().int().min(0).optional(),
  max_price_cents: z.number().int().min(0).optional(),
  city: z.string().max(120).optional(),
  pricing_mode: PricingModeEnum.optional(),
});

export type VenueInput = z.infer<typeof VenueInputSchema>;

// Cache invalidation lives in the use case so any caller (UI, webhook,
// background job) automatically keeps the cache consistent.
async function invalidateVenuesCache(cache: CacheStore) {
  try {
    await cache.invalidateNamespace("venues");
  } catch {
    /* cache failures must never break a write */
  }
}

// ---------- Use cases ----------

export const listVenuesUseCase =
  (repo: VenuesRepo) =>
  (filter: VenueListFilter): Promise<VenueListItem[]> =>
    repo.listActive(filter);

export const getVenueUseCase =
  (repo: VenuesRepo) =>
  async (id: string): Promise<Venue> => {
    const v = await repo.findById(id);
    if (!v) throw new Error("Venue not found");
    return v;
  };

export const listHostVenuesUseCase =
  (repo: VenuesRepo) =>
  (hostId: string): Promise<Venue[]> =>
    repo.listByHost(hostId);

export const createVenueUseCase =
  (venues: VenuesRepo, roles: UserRolesRepo, cache: CacheStore) =>
  async (input: VenueInput, hostId: string): Promise<Venue> => {
    await roles.promoteSelfToHost();
    const v = await venues.create({ ...(input as VenueWriteInput), host_id: hostId });
    await invalidateVenuesCache(cache);
    return v;
  };

export const updateVenueUseCase =
  (repo: VenuesRepo, cache: CacheStore) =>
  async (id: string, patch: Partial<VenueInput>): Promise<Venue> => {
    const v = await repo.update(id, patch as Partial<VenueWriteInput>);
    await invalidateVenuesCache(cache);
    return v;
  };

export const deleteVenueUseCase =
  (repo: VenuesRepo, cache: CacheStore) =>
  async (id: string): Promise<void> => {
    await repo.delete(id);
    await invalidateVenuesCache(cache);
  };

export const becomeHostUseCase = (roles: UserRolesRepo) => (): Promise<void> =>
  roles.promoteSelfToHost();
