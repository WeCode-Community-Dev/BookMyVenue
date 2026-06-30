// Infrastructure — Composition Root (plain factory, no IoC container).
// Wires concrete providers + repositories and exposes every use-case
// as a property on a typed AppServices object.
//
// THIS FILE IS THE ONLY PLACE THAT KNOWS WHICH PROVIDER IS IN USE.
// Swap auth/storage/db/cache here to migrate to a different vendor.

import { getCloudflareEnv } from "@/lib/cloudflare-env";
import {
  makeDrizzleAdminRepo,
  makeDrizzleBookingsRepo,
  makeDrizzleCouponsRepo,
  makeDrizzleInvoicesRepo,
  makeDrizzlePaymentsRepo,
  makeDrizzleProfilesRepo,
  makeDrizzleReviewsRepo,
  makeDrizzleUserRolesRepo,
  makeDrizzleVenuesRepo,
  makePdfLibInvoiceRenderer,
  makeResendEmailSender,
  makeBetterAuthProvider,
  CacheStoreManager,
  makeDrizzleD1Factory,
} from "@repo/infrastructure";
import {
  cancelBookingUseCase,
  confirmBookingUseCase,
  createBlockOffUseCase,
  createBookingHoldUseCase,
  createOfflineBookingUseCase,
  getBookingUseCase,
  listHostBookingsUseCase,
  listMyBookingsUseCase,
  quoteBookingUseCase,
} from "@repo/application/bookings";
import {
  becomeHostUseCase,
  createVenueUseCase,
  deleteVenueUseCase,
  getVenueUseCase,
  listHostVenuesUseCase,
  listVenuesUseCase,
  updateVenueUseCase,
} from "@repo/application/venues";
import {
  createCouponUseCase,
  deleteCouponUseCase,
  listHostCouponsUseCase,
} from "@repo/application/coupons";
import {
  canIReviewVenueUseCase,
  deleteMyReviewUseCase,
  listVenueReviewsUseCase,
  upsertMyReviewUseCase,
} from "@repo/application/reviews";
import {
  deleteReviewAsAdminUseCase,
  expireStuckBookingsUseCase,
  getUserDetailUseCase,
  listAllBookingsUseCase,
  listAllCouponsUseCase,
  listAllReviewsUseCase,
  listAllUsersUseCase,
  listAllVenuesUseCase,
  platformStatsUseCase,
  setCouponActiveUseCase,
  setUserRoleUseCase,
  setUserSuspendedUseCase,
  setVenueSuspendedAsAdminUseCase,
  updateBookingStatusUseCase,
} from "@repo/application/admin";
import {
  generateAndSendInvoiceUseCase,
  getInvoiceDownloadUrlUseCase,
} from "@repo/application/invoices";

import type {
  AdminRepo,
  AuthProvider,
  BookingsRepo,
  CacheStore,
  CouponsRepo,
  DbHandle,
  EmailSender,
  InvoicePdfRenderer,
  InvoiceStorage,
  InvoicesRepo,
  PaymentsRepo,
  ProfilesRepo,
  ReviewsRepo,
  StorageProvider,
  UserRolesRepo,
  VenuesRepo,
} from "@repo/contracts";

// ---------- Public types ----------

export interface RootOptions {
  /**
   * Database handle (D1 database binding).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db?: any;
  /** Override admin client — defaults to the D1 database binding. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminDb?: any;
  /** Current authenticated user ID. */
  userId?: string;
  /** Cloudflare KV cache namespace binding. */
  cacheKv?: any;
}

export interface AppServices {
  // ---- Infrastructure handles ----
  adminDb: DbHandle;
  userDb: DbHandle | undefined;
  userId: string | undefined;
  auth: AuthProvider;
  storage: StorageProvider;
  cache: CacheStore;

  // ---- Repositories (ports) ----
  venuesRepo: VenuesRepo;
  userRolesRepo: UserRolesRepo;
  bookingsRepo: BookingsRepo;
  paymentsRepo: PaymentsRepo;
  couponsRepo: CouponsRepo;
  reviewsRepo: ReviewsRepo;
  adminRepo: AdminRepo;
  invoicesRepo: InvoicesRepo;
  profilesRepo: ProfilesRepo;
  invoiceStorage: InvoiceStorage;
  invoicePdfRenderer: InvoicePdfRenderer;
  emailSender: EmailSender;

  // ---- Use cases — Venues ----
  listVenues: ReturnType<typeof listVenuesUseCase>;
  getVenue: ReturnType<typeof getVenueUseCase>;
  listHostVenues: ReturnType<typeof listHostVenuesUseCase>;
  createVenue: ReturnType<typeof createVenueUseCase>;
  updateVenue: ReturnType<typeof updateVenueUseCase>;
  deleteVenue: ReturnType<typeof deleteVenueUseCase>;
  becomeHost: ReturnType<typeof becomeHostUseCase>;

  // ---- Use cases — Bookings ----
  quoteBooking: ReturnType<typeof quoteBookingUseCase>;
  createBookingHold: ReturnType<typeof createBookingHoldUseCase>;
  confirmBooking: ReturnType<typeof confirmBookingUseCase>;
  cancelBooking: ReturnType<typeof cancelBookingUseCase>;
  listMyBookings: ReturnType<typeof listMyBookingsUseCase>;
  listHostBookings: ReturnType<typeof listHostBookingsUseCase>;
  getBooking: ReturnType<typeof getBookingUseCase>;
  createOfflineBooking: ReturnType<typeof createOfflineBookingUseCase>;
  createBlockOff: ReturnType<typeof createBlockOffUseCase>;

  // ---- Use cases — Coupons ----
  listHostCoupons: ReturnType<typeof listHostCouponsUseCase>;
  createCoupon: ReturnType<typeof createCouponUseCase>;
  deleteCoupon: ReturnType<typeof deleteCouponUseCase>;

  // ---- Use cases — Reviews ----
  listVenueReviews: ReturnType<typeof listVenueReviewsUseCase>;
  canIReviewVenue: ReturnType<typeof canIReviewVenueUseCase>;
  upsertMyReview: ReturnType<typeof upsertMyReviewUseCase>;
  deleteMyReview: ReturnType<typeof deleteMyReviewUseCase>;

  // ---- Use cases — Admin ----
  platformStats: ReturnType<typeof platformStatsUseCase>;
  listAllUsers: ReturnType<typeof listAllUsersUseCase>;
  getUserDetail: ReturnType<typeof getUserDetailUseCase>;
  setUserRole: ReturnType<typeof setUserRoleUseCase>;
  setUserSuspended: ReturnType<typeof setUserSuspendedUseCase>;
  listAllVenues: ReturnType<typeof listAllVenuesUseCase>;
  setVenueSuspended: ReturnType<typeof setVenueSuspendedAsAdminUseCase>;
  listAllBookings: ReturnType<typeof listAllBookingsUseCase>;
  updateBookingStatus: ReturnType<typeof updateBookingStatusUseCase>;
  expireStuckBookings: ReturnType<typeof expireStuckBookingsUseCase>;
  listAllCoupons: ReturnType<typeof listAllCouponsUseCase>;
  setCouponActive: ReturnType<typeof setCouponActiveUseCase>;
  listAllReviews: ReturnType<typeof listAllReviewsUseCase>;
  deleteReviewAsAdmin: ReturnType<typeof deleteReviewAsAdminUseCase>;

  // ---- Use cases — Invoices ----
  generateAndSendInvoice: ReturnType<typeof generateAndSendInvoiceUseCase>;
  getInvoiceDownloadUrl: ReturnType<typeof getInvoiceDownloadUrlUseCase>;
}

// ---------- Factory ----------

/**
 * Build a request-scoped services object. Pass `db` for authenticated calls
 * so writes are scoped to the caller; omit it for public reads.
 */
export function buildServices(opts: RootOptions = {}): AppServices {
  let d1 = opts.db ?? opts.adminDb ?? getCloudflareEnv().DB;

  if (!d1) {
    // Fallback/Mock for local build & typecheck tasks if DB is not bound yet
    d1 = {
      prepare: () => ({ bind: () => ({ all: async () => [] }) }),
      exec: async () => {},
      batch: async () => [],
    };
  }

  const dbFactory = makeDrizzleD1Factory({ d1 });
  const adminDb = dbFactory.admin();
  const userDb = opts.db ? dbFactory.forUser("") : adminDb;
  const userId = opts.userId;

  // Better Auth client placeholder (the actual client is initialized on frontend)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = makeBetterAuthProvider({} as any);

  // Storage provider stub (Phase 4 will wire up R2)
  const storage: StorageProvider = {
    getPublicUrl: (_b: string, p: string) => p,
    createSignedUploadUrl: () => {
      throw new Error("Storage migration pending");
    },
    createSignedDownloadUrl: () => {
      throw new Error("Storage migration pending");
    },
    upload: () => {
      throw new Error("Storage migration pending");
    },
    delete: () => {
      throw new Error("Storage migration pending");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  // Cache
  const cache = new CacheStoreManager({
    drizzleDb: adminDb,
    kv: opts.cacheKv ?? getCloudflareEnv().CACHE_KV,
    upstashUrl: process.env.UPSTASH_REDIS_REST_URL,
    upstashToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // ---- Repositories (singletons within this request scope) ----
  const venuesRepo = makeDrizzleVenuesRepo({ adminDb, userDb });
  const userRolesRepo = makeDrizzleUserRolesRepo({ adminDb, userDb, userId });
  const bookingsRepo = makeDrizzleBookingsRepo({ adminDb, userDb });
  const paymentsRepo = makeDrizzlePaymentsRepo({ adminDb });
  const couponsRepo = makeDrizzleCouponsRepo({ adminDb, userDb });
  const reviewsRepo = makeDrizzleReviewsRepo({ adminDb, userDb });
  const adminRepo = makeDrizzleAdminRepo({ adminDb });
  const invoicesRepo = makeDrizzleInvoicesRepo({ adminDb });
  const profilesRepo = makeDrizzleProfilesRepo({ adminDb });

  // Invoice storage stub (Phase 4 will wire up R2)
  const invoiceStorage: InvoiceStorage = {
    upload: async (p: string) => ({ path: p }),
    createSignedDownloadUrl: async (p: string) => p,
  };

  const invoicePdfRenderer = makePdfLibInvoiceRenderer();
  const emailSender = makeResendEmailSender({
    defaultFrom: process.env.INVOICE_FROM_EMAIL ?? "Book My Venue <onboarding@resend.dev>",
  });

  // ---- Invoice + email use cases ----
  const generateAndSendInvoice = generateAndSendInvoiceUseCase({
    invoices: invoicesRepo,
    storage: invoiceStorage,
    renderer: invoicePdfRenderer,
    email: emailSender,
    profiles: profilesRepo,
    brand: {
      name: "Book My Venue",
      supportEmail: process.env.SUPPORT_EMAIL ?? "support@bookmyvenue.app",
    },
  });

  const getInvoiceDownloadUrl = getInvoiceDownloadUrlUseCase({
    invoices: invoicesRepo,
    storage: invoiceStorage,
    bookings: bookingsRepo,
    roles: userRolesRepo,
  });

  // ---- Use cases — pure functions composed with their dependencies ----

  // Venues
  const listVenues = listVenuesUseCase(venuesRepo);
  const getVenue = getVenueUseCase(venuesRepo);
  const listHostVenues = listHostVenuesUseCase(venuesRepo);
  const createVenue = createVenueUseCase(venuesRepo, userRolesRepo, cache);
  const updateVenue = updateVenueUseCase(venuesRepo, cache);
  const deleteVenue = deleteVenueUseCase(venuesRepo, cache);
  const becomeHost = becomeHostUseCase(userRolesRepo);

  // Bookings
  const quoteBooking = quoteBookingUseCase(bookingsRepo, couponsRepo);
  const createBookingHold = createBookingHoldUseCase(bookingsRepo, couponsRepo, cache);
  const confirmBooking = confirmBookingUseCase(
    bookingsRepo,
    paymentsRepo,
    couponsRepo,
    cache,
    {
      onConfirmed: async (booking) => {
        const withVenue = await bookingsRepo.findWithVenue(booking.id);
        if (withVenue) await generateAndSendInvoice({ booking: withVenue });
      },
    },
  );
  const cancelBooking = cancelBookingUseCase(bookingsRepo);
  const listMyBookings = listMyBookingsUseCase(bookingsRepo);
  const listHostBookings = listHostBookingsUseCase(bookingsRepo);
  const getBooking = getBookingUseCase(bookingsRepo);
  const createOfflineBooking = createOfflineBookingUseCase(bookingsRepo);
  const createBlockOff = createBlockOffUseCase(bookingsRepo);

  // Coupons
  const listHostCoupons = listHostCouponsUseCase(couponsRepo);
  const createCoupon = createCouponUseCase(couponsRepo);
  const deleteCoupon = deleteCouponUseCase(couponsRepo);

  // Reviews
  const listVenueReviews = listVenueReviewsUseCase(reviewsRepo);
  const canIReviewVenue = canIReviewVenueUseCase(reviewsRepo);
  const upsertMyReview = upsertMyReviewUseCase(reviewsRepo);
  const deleteMyReview = deleteMyReviewUseCase(reviewsRepo);

  // Admin
  const platformStats = platformStatsUseCase(adminRepo, userRolesRepo);
  const listAllUsers = listAllUsersUseCase(adminRepo, userRolesRepo);
  const getUserDetail = getUserDetailUseCase(adminRepo, userRolesRepo);
  const setUserRole = setUserRoleUseCase(userRolesRepo);
  const setUserSuspended = setUserSuspendedUseCase(adminRepo, userRolesRepo);
  const listAllVenues = listAllVenuesUseCase(adminRepo, userRolesRepo);
  const setVenueSuspended = setVenueSuspendedAsAdminUseCase(adminRepo, userRolesRepo, cache);
  const listAllBookings = listAllBookingsUseCase(adminRepo, userRolesRepo);
  const updateBookingStatus = updateBookingStatusUseCase(adminRepo, userRolesRepo);
  const expireStuckBookings = expireStuckBookingsUseCase(adminRepo, userRolesRepo);
  const listAllCoupons = listAllCouponsUseCase(adminRepo, userRolesRepo);
  const setCouponActive = setCouponActiveUseCase(adminRepo, userRolesRepo);
  const listAllReviews = listAllReviewsUseCase(adminRepo, userRolesRepo);
  const deleteReviewAsAdmin = deleteReviewAsAdminUseCase(reviewsRepo, userRolesRepo);

  return {
    // Infrastructure
    adminDb,
    userDb,
    userId,
    auth,
    storage,
    cache,

    // Repos
    venuesRepo,
    userRolesRepo,
    bookingsRepo,
    paymentsRepo,
    couponsRepo,
    reviewsRepo,
    adminRepo,
    invoicesRepo,
    profilesRepo,
    invoiceStorage,
    invoicePdfRenderer,
    emailSender,

    // Use cases — Venues
    listVenues,
    getVenue,
    listHostVenues,
    createVenue,
    updateVenue,
    deleteVenue,
    becomeHost,

    // Use cases — Bookings
    quoteBooking,
    createBookingHold,
    confirmBooking,
    cancelBooking,
    listMyBookings,
    listHostBookings,
    getBooking,
    createOfflineBooking,
    createBlockOff,

    // Use cases — Coupons
    listHostCoupons,
    createCoupon,
    deleteCoupon,

    // Use cases — Reviews
    listVenueReviews,
    canIReviewVenue,
    upsertMyReview,
    deleteMyReview,

    // Use cases — Admin
    platformStats,
    listAllUsers,
    getUserDetail,
    setUserRole,
    setUserSuspended,
    listAllVenues,
    setVenueSuspended,
    listAllBookings,
    updateBookingStatus,
    expireStuckBookings,
    listAllCoupons,
    setCouponActive,
    listAllReviews,
    deleteReviewAsAdmin,

    // Use cases — Invoices
    generateAndSendInvoice,
    getInvoiceDownloadUrl,
  };
}
