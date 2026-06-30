// Presentation/server adapter — Coupons

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-middleware";
import { CouponSchema } from "@repo/application/coupons";
import { buildServices } from "@/infrastructure/services";

export const listHostCoupons = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(({ context }) =>
    buildServices({ db: context.db, userId: context.userId }).listHostCoupons(
      context.userId,
    ),
  );

export const createCoupon = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => CouponSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).createCoupon(
      data,
      context.userId,
    ),
  );

export const deleteCoupon = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId })
      .deleteCoupon(data.id)
      .then(() => ({ ok: true as const })),
  );
