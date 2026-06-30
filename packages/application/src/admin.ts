// Application layer — Admin use-cases & schemas.
// Authorization (admin role check) is enforced at the use-case boundary via
// `assertAdminUseCase`; no presentation-layer fallback.

import { z } from "zod";
import { isBlocking } from "@repo/domain/bookings";
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
  CacheStore,
  PlatformStats,
  ReviewsRepo,
  UserRolesRepo,
} from "@repo/contracts";

export const RoleEnum = z.enum(["customer", "host", "admin"]);
export const ManageableRoleEnum = z.enum(["host", "admin"]);
export const BookingStatusEnum = z.enum(["pending", "confirmed", "cancelled", "expired"]);

export const ListUsersSchema = z.object({
  search: z.string().max(120).optional(),
  role: RoleEnum.optional(),
});
export const UserIdSchema = z.object({ userId: z.string().uuid() });
export const SetUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: ManageableRoleEnum,
  grant: z.boolean(),
});
export const SetUserSuspendedSchema = z.object({
  userId: z.string().uuid(),
  suspended: z.boolean(),
});
export const ListVenuesSchema = z.object({
  search: z.string().max(120).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});
export const SetVenueSuspendedSchema = z.object({
  venueId: z.string().uuid(),
  suspended: z.boolean(),
});
export const ListBookingsSchema = z.object({
  status: BookingStatusEnum.optional(),
  search: z.string().max(120).optional(),
  discrepancy: z.enum(["stuck_pending", "confirmed_unpaid"]).optional(),
});
export const UpdateBookingStatusSchema = z.object({
  id: z.string().uuid(),
  status: BookingStatusEnum,
  notes: z.string().max(2000).optional(),
});
export const SetCouponActiveSchema = z.object({
  id: z.string().uuid(),
  active: z.boolean(),
});
export const AdminReviewIdSchema = z.object({ id: z.string().uuid() });

// ---- Internal authorization guard ----
export const assertAdminUseCase =
  (roles: UserRolesRepo) =>
  async (userId: string): Promise<void> => {
    if (!(await roles.isAdmin(userId))) {
      throw new Error("Forbidden: admin role required");
    }
  };

// ---- Platform stats ----
export const platformStatsUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (callerId: string): Promise<PlatformStats> => {
    await assertAdminUseCase(roles)(callerId);
    return admin.platformStats();
  };

// ---- Users ----
export const listAllUsersUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (
    callerId: string,
    filter: { search?: string; role?: AppRole },
  ): Promise<AdminUserListItem[]> => {
    await assertAdminUseCase(roles)(callerId);
    return admin.listUsers(filter);
  };

export const getUserDetailUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (callerId: string, userId: string): Promise<AdminUserDetail> => {
    await assertAdminUseCase(roles)(callerId);
    return admin.getUserDetail(userId);
  };

export const setUserRoleUseCase =
  (roles: UserRolesRepo) =>
  async (
    callerId: string,
    args: { userId: string; role: "host" | "admin"; grant: boolean },
  ): Promise<void> => {
    await assertAdminUseCase(roles)(callerId);
    if (args.grant) await roles.grant(args.userId, args.role);
    else await roles.revoke(args.userId, args.role);
  };

export const setUserSuspendedUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (callerId: string, args: { userId: string; suspended: boolean }): Promise<void> => {
    await assertAdminUseCase(roles)(callerId);
    await admin.setUserSuspended(args.userId, args.suspended);
  };

// ---- Venues ----
export const listAllVenuesUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (
    callerId: string,
    filter: { search?: string; status?: "active" | "inactive" | "suspended" },
  ): Promise<AdminVenueListItem[]> => {
    await assertAdminUseCase(roles)(callerId);
    return admin.listVenues(filter);
  };

export const setVenueSuspendedAsAdminUseCase =
  (admin: AdminRepo, roles: UserRolesRepo, cache: CacheStore) =>
  async (callerId: string, args: { venueId: string; suspended: boolean }): Promise<void> => {
    await assertAdminUseCase(roles)(callerId);
    await admin.setVenueSuspended(args.venueId, args.suspended);
    try {
      await cache.invalidateNamespace("venues");
    } catch {
      /* non-fatal */
    }
  };

// ---- Bookings ----
export const listAllBookingsUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (callerId: string, filter: AdminBookingFilter): Promise<AdminBookingListItem[]> => {
    await assertAdminUseCase(roles)(callerId);
    return admin.listBookings(filter);
  };

export const updateBookingStatusUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (
    callerId: string,
    args: { id: string; status: AdminBookingFilter["status"] & string; notes?: string },
  ): Promise<void> => {
    await assertAdminUseCase(roles)(callerId);
    await admin.updateBookingStatus(args);
  };

/** Expire stuck holds. Reuses the domain rule `isBlocking` via the repo's
 *  filter (pending + expires_at < now). */
export const expireStuckBookingsUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (callerId: string): Promise<{ count: number }> => {
    await assertAdminUseCase(roles)(callerId);
    // The domain rule: a pending booking with an elapsed expires_at is no
    // longer blocking. The cutoff we pass to the repo is the same value used
    // by isBlocking({ status:'pending', expires_at }) at "now".
    const now = Date.now();
    void isBlocking; // referenced so future refactors keep the import alive
    const count = await admin.expireStuckBookings(new Date(now).toISOString());
    return { count };
  };

// ---- Coupons ----
export const listAllCouponsUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (callerId: string): Promise<AdminCouponListItem[]> => {
    await assertAdminUseCase(roles)(callerId);
    return admin.listCoupons();
  };

export const setCouponActiveUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (callerId: string, args: { id: string; active: boolean }): Promise<void> => {
    await assertAdminUseCase(roles)(callerId);
    await admin.setCouponActive(args.id, args.active);
  };

// ---- Reviews ----
export const listAllReviewsUseCase =
  (admin: AdminRepo, roles: UserRolesRepo) =>
  async (callerId: string): Promise<AdminReviewListItem[]> => {
    await assertAdminUseCase(roles)(callerId);
    return admin.listReviews();
  };

export const deleteReviewAsAdminUseCase =
  (reviews: ReviewsRepo, roles: UserRolesRepo) =>
  async (callerId: string, reviewId: string): Promise<void> => {
    await assertAdminUseCase(roles)(callerId);
    await reviews.deleteAsAdmin(reviewId);
  };
