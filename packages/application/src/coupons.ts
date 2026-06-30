// Application layer — Coupons use-cases & schemas

import { z } from "zod";
import type { Coupon } from "@repo/domain/coupons";
import type { CouponsRepo, CouponWriteInput } from "@repo/contracts";

export const CouponSchema = z.object({
  code: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[A-Z0-9_-]+$/i),
  venue_id: z.string().uuid().optional().nullable(),
  discount_type: z.enum(["percentage", "fixed_amount"]),
  discount_value: z.number().positive().max(100000),
  valid_from: z.string().datetime().optional(),
  valid_until: z.string().datetime().optional().nullable(),
  usage_limit: z.number().int().positive().optional().nullable(),
  is_active: z.boolean().default(true),
});
export type CouponInput = z.infer<typeof CouponSchema>;

export const listHostCouponsUseCase = (repo: CouponsRepo) => (hostId: string) =>
  repo.listForHostVenues(hostId);

export const createCouponUseCase =
  (repo: CouponsRepo) =>
  (input: CouponInput, createdBy: string): Promise<Coupon> =>
    repo.create({
      ...(input as CouponWriteInput),
      code: input.code.toUpperCase(),
      venue_id: input.venue_id ?? null,
      created_by: createdBy,
    });

export const deleteCouponUseCase =
  (repo: CouponsRepo) =>
  (id: string): Promise<void> =>
    repo.delete(id);
