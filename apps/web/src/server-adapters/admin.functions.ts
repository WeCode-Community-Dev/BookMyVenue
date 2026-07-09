// Presentation/server adapter — Admin
// Authorization checks are enforced inside each use case via
// `assertAdminUseCase`. These adapters only validate input and dispatch.

import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "@/lib/auth-middleware";
import {
  AdminReviewIdSchema,
  ListBookingsSchema,
  ListUsersSchema,
  ListVenuesSchema,
  SetCouponActiveSchema,
  SetUserRoleSchema,
  SetUserSuspendedSchema,
  SetVenueSuspendedSchema,
  UpdateBookingStatusSchema,
  UserIdSchema,
} from "@repo/application/admin";
import { buildServices } from "@/infrastructure/services";

function svc(db?: unknown, userId?: string) {
  return db ? buildServices({ db: db as never, userId }) : buildServices();
}

export const requireAdmin = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    const s = svc(context.db, context.userId);
    if (!(await s.userRolesRepo.isAdmin(context.userId))) {
      throw new Error("Forbidden: admin role required");
    }
    return { ok: true as const };
  });

export const getPlatformStats = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(({ context }) =>
    svc(context.db, context.userId).platformStats(context.userId),
  );

// ---- Users ----
export const listAllUsers = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => ListUsersSchema.parse(input ?? {}))
  .handler(({ data, context }) =>
    svc(context.db, context.userId).listAllUsers(context.userId, data),
  );

export const getUserDetail = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => UserIdSchema.parse(input))
  .handler(({ data, context }) =>
    svc(context.db, context.userId).getUserDetail(context.userId, data.userId),
  );

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => SetUserRoleSchema.parse(input))
  .handler(async ({ data, context }) => {
    await svc(context.db, context.userId).setUserRole(context.userId, data);
    return { ok: true as const };
  });

export const setUserSuspended = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => SetUserSuspendedSchema.parse(input))
  .handler(async ({ data, context }) => {
    await svc(context.db, context.userId).setUserSuspended(context.userId, data);
    return { ok: true as const };
  });

// ---- Venues ----
export const listAllVenues = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => ListVenuesSchema.parse(input ?? {}))
  .handler(({ data, context }) =>
    svc(context.db, context.userId).listAllVenues(context.userId, data),
  );

export const setVenueSuspended = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => SetVenueSuspendedSchema.parse(input))
  .handler(async ({ data, context }) => {
    await svc(context.db, context.userId).setVenueSuspended(context.userId, data);
    return { ok: true as const };
  });

// ---- Bookings ----
export const listAllBookings = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => ListBookingsSchema.parse(input ?? {}))
  .handler(({ data, context }) =>
    svc(context.db, context.userId).listAllBookings(context.userId, data),
  );

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => UpdateBookingStatusSchema.parse(input))
  .handler(async ({ data, context }) => {
    await svc(context.db, context.userId).updateBookingStatus(context.userId, data);
    return { ok: true as const };
  });

export const expireStuckBookings = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .handler(({ context }) =>
    svc(context.db, context.userId).expireStuckBookings(context.userId),
  );

// ---- Coupons ----
export const listAllCoupons = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(({ context }) =>
    svc(context.db, context.userId).listAllCoupons(context.userId),
  );

export const setCouponActive = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => SetCouponActiveSchema.parse(input))
  .handler(async ({ data, context }) => {
    await svc(context.db, context.userId).setCouponActive(context.userId, data);
    return { ok: true as const };
  });

// ---- Reviews ----
export const listAllReviews = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(({ context }) =>
    svc(context.db, context.userId).listAllReviews(context.userId),
  );

export const deleteReview = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => AdminReviewIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    await svc(context.db, context.userId).deleteReviewAsAdmin(context.userId, data.id);
    return { ok: true as const };
  });
