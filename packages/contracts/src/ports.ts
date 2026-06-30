// Application contracts (ports) — shared between application and infrastructure layers.

import type {
  Venue,
  VenueListFilter,
  VenueAddress,
  VenueType,
  PricingMode,
} from "@repo/domain/venues";
import type { Booking, BookingStatus, BookingSource } from "@repo/domain/bookings";
import type { Coupon, DiscountType } from "@repo/domain/coupons";
import type { Review } from "@repo/domain/reviews";

// ---------- Venues ----------
export interface VenueListItem {
  id: string;
  name: string;
  venue_type: VenueType;
  capacity: number;
  base_price_cents: number;
  currency: string;
  pricing_mode: PricingMode;
  address_data: VenueAddress;
  cover_image_url: string | null;
  description: string | null;
}

export interface VenueWriteInput {
  name: string;
  description: string;
  venue_type: VenueType;
  capacity: number;
  base_price_cents: number;
  currency: string;
  pricing_mode: PricingMode;
  address_data: VenueAddress;
  amenities: string[];
  cover_image_url: string | null;
  gallery_urls: string[];
  is_active: boolean;
}

export interface VenuesRepo {
  listActive(filter: VenueListFilter): Promise<VenueListItem[]>;
  findById(id: string): Promise<Venue | null>;
  listByHost(hostId: string): Promise<Venue[]>;
  create(input: VenueWriteInput & { host_id: string }): Promise<Venue>;
  update(id: string, patch: Partial<VenueWriteInput>): Promise<Venue>;
  delete(id: string): Promise<void>;
}

// ---------- User Roles ----------
export type AppRole = "customer" | "host" | "admin";

export interface UserRolesRepo {
  promoteSelfToHost(): Promise<void>;
  isAdmin(userId: string): Promise<boolean>;
  grant(userId: string, role: Exclude<AppRole, "customer">): Promise<void>;
  revoke(userId: string, role: Exclude<AppRole, "customer">): Promise<void>;
  listForUser(userId: string): Promise<AppRole[]>;
}

// ---------- Bookings ----------
export interface BookingVenueSummary {
  name: string;
  address_data?: VenueAddress | null;
  cover_image_url?: string | null;
  host_id?: string | null;
}

export type BookingWithVenue = Booking & { venues: BookingVenueSummary | null };

export interface BookingsRepo {
  findVenuePricing(
    id: string,
  ): Promise<Pick<Venue, "id" | "base_price_cents" | "currency" | "pricing_mode"> | null>;

  findConflicts(args: {
    venue_id: string;
    start_time: string;
    end_time: string;
  }): Promise<Array<Pick<Booking, "id" | "status" | "expires_at">>>;
  create(input: Omit<Booking, "id" | "version">): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  updateStatus(args: {
    id: string;
    version: number;
    status: BookingStatus;
    expires_at: string | null;
  }): Promise<Booking>;
  setStatus(id: string, status: BookingStatus): Promise<void>;
  listForCustomer(customerId: string): Promise<BookingWithVenue[]>;
  listForHost(hostId: string): Promise<BookingWithVenue[]>;
  findWithVenue(id: string): Promise<BookingWithVenue | null>;
}

export interface PaymentsRepo {
  recordSuccess(args: {
    booking_id: string;
    amount_cents: number;
    currency: string;
    transaction_id: string;
  }): Promise<void>;
}

// ---------- Coupons ----------
export interface CouponWriteInput {
  code: string;
  venue_id: string | null;
  discount_type: DiscountType;
  discount_value: number;
  valid_from?: string;
  valid_until?: string | null;
  usage_limit?: number | null;
  is_active: boolean;
}

export type CouponWithVenue = Coupon & {
  created_at?: string;
  venues: { name: string } | null;
};

export interface CouponsRepo {
  findActiveByCode(code: string): Promise<Coupon | null>;
  incrementUsage(id: string): Promise<void>;
  listForHostVenues(hostId: string): Promise<CouponWithVenue[]>;
  create(input: CouponWriteInput & { created_by: string }): Promise<Coupon>;
  delete(id: string): Promise<void>;
}

// ---------- Reviews ----------
export interface ReviewListItem {
  id: string;
  user_id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
  updated_at: string;
  reviewer_name: string;
}

export interface ReviewSummary {
  reviews: ReviewListItem[];
  average: number;
  count: number;
}

export interface ReviewsRepo {
  listForVenue(venueId: string): Promise<ReviewSummary>;
  hasConfirmedBooking(userId: string, venueId: string): Promise<boolean>;
  findByUserAndVenue(userId: string, venueId: string): Promise<Review | null>;
  upsert(input: {
    userId: string;
    venueId: string;
    rating: number;
    feedback: string | null;
  }): Promise<Review>;
  deleteByOwner(reviewId: string, userId: string): Promise<void>;
  deleteAsAdmin(reviewId: string): Promise<void>;
}

// ---------- Cache ----------
export type CacheNamespace = "venues";

export interface CacheStore {
  get(ns: CacheNamespace, key: string): Promise<unknown | null>;
  set(ns: CacheNamespace, key: string, value: unknown, ttlSeconds: number): Promise<void>;
  invalidateNamespace(ns: CacheNamespace): Promise<void>;
}

// ---------- Admin ----------
export interface PlatformStats {
  users_total: number;
  users_suspended: number;
  users_new_30d: number;
  hosts_total: number;
  admins_total: number;
  venues_total: number;
  venues_active: number;
  venues_suspended: number;
  bookings_total: number;
  bookings_by_status: Record<string, number>;
  bookings_30d: number;
  bookings_pending_expired: number;
  revenue_cents_total: number;
  revenue_cents_30d: number;
  confirmed_without_payment: number;
  bookings_trend_30d: Array<{ day: string; count: number }>;
}

export interface AdminUserListItem {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_suspended: boolean;
  created_at: string;
  roles: AppRole[];
}

export interface AdminProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_suspended: boolean;
  created_at: string;
}

export interface AdminUserDetail {
  profile: AdminProfile | null;
  roles: AppRole[];
  bookings: Array<{
    id: string;
    venue_id: string;
    start_time: string;
    total_cents: number;
    currency: string;
    status: string;
    created_at: string;
    venues: { name: string } | null;
  }>;
  venues: Array<{
    id: string;
    name: string;
    is_active: boolean;
    is_suspended: boolean;
    created_at: string;
  }>;
  reviews: Array<{
    id: string;
    venue_id: string;
    rating: number;
    feedback: string | null;
    created_at: string;
    venues: { name: string } | null;
  }>;
}

export interface AdminVenueListItem {
  id: string;
  host_id: string;
  name: string;
  venue_type: VenueType;
  capacity: number;
  base_price_cents: number;
  currency: string;
  pricing_mode: PricingMode;
  is_active: boolean;
  is_suspended: boolean;
  created_at: string;
  address_data: VenueAddress | null;
  cover_image_url: string | null;
  host: {
    id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export interface AdminBookingFilter {
  status?: BookingStatus;
  search?: string;
  discrepancy?: "stuck_pending" | "confirmed_unpaid";
}

export interface AdminBookingListItem {
  id: string;
  venue_id: string;
  customer_id: string | null;
  start_time: string;
  end_time: string;
  total_cents: number;
  currency: string;
  status: BookingStatus;
  source: BookingSource;
  guest_email: string | null;
  guest_name: string | null;
  expires_at: string | null;
  created_at: string;
  notes: string | null;
  venues: { name: string; host_id: string | null } | null;
  payments: Array<{ id: string; status: string; amount_cents: number }>;
  customer: {
    id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export interface AdminCouponListItem extends Coupon {
  created_at: string;
  venues: { name: string } | null;
}

export interface AdminReviewListItem {
  id: string;
  user_id: string;
  venue_id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
  venues: { name: string } | null;
  user: {
    id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export interface AdminRepo {
  platformStats(): Promise<PlatformStats>;
  listUsers(filter: { search?: string; role?: AppRole }): Promise<AdminUserListItem[]>;
  getUserDetail(userId: string): Promise<AdminUserDetail>;
  setUserSuspended(userId: string, suspended: boolean): Promise<void>;
  listVenues(filter: {
    search?: string;
    status?: "active" | "inactive" | "suspended";
  }): Promise<AdminVenueListItem[]>;
  setVenueSuspended(venueId: string, suspended: boolean): Promise<void>;
  listBookings(filter: AdminBookingFilter): Promise<AdminBookingListItem[]>;
  updateBookingStatus(args: { id: string; status: BookingStatus; notes?: string }): Promise<void>;
  expireStuckBookings(nowIso: string): Promise<number>;
  listCoupons(): Promise<AdminCouponListItem[]>;
  setCouponActive(id: string, active: boolean): Promise<void>;
  listReviews(): Promise<AdminReviewListItem[]>;
}

// ---------- Profiles (minimal lookup for outgoing comms) ----------
export interface ProfileContact {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

export interface ProfilesRepo {
  findById(userId: string): Promise<ProfileContact | null>;
}

// ---------- Invoices ----------
import type { Invoice } from "@repo/domain/invoices";

export interface InvoicesRepo {
  findByBookingId(bookingId: string): Promise<Invoice | null>;
  create(input: Omit<Invoice, "id">): Promise<Invoice>;
  markSent(id: string, sentAt: string, recipientEmail: string): Promise<void>;
}

/** Input passed to the PDF renderer. Plain data — no I/O. */
export interface InvoicePdfInput {
  invoice_number: string;
  issued_at: string;
  brand_name: string;
  support_email: string;
  customer: { name: string; email: string | null };
  venue: { name: string; address: string };
  booking: {
    id: string;
    start_time: string;
    end_time: string;
    guest_count: number | null;
  };
  line_items: Array<{ description: string; amount_cents: number }>;
  discount_cents: number;
  subtotal_cents: number;
  total_cents: number;
  currency: string;
  payment: { method: string | null; amount_paid_cents: number; status: string };
}

export interface InvoicePdfRenderer {
  render(input: InvoicePdfInput): Promise<Uint8Array>;
}

/** Storage adapter dedicated to invoice PDFs (private bucket). */
export interface InvoiceStorage {
  upload(path: string, bytes: Uint8Array): Promise<{ path: string }>;
  createSignedDownloadUrl(path: string, expiresInSeconds?: number): Promise<string>;
}

// ---------- Email ----------
export interface EmailAttachment {
  filename: string;
  /** Base64-encoded file contents. */
  content: string;
  contentType?: string;
}

export interface EmailMessage {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
}

export interface EmailSender {
  send(message: EmailMessage): Promise<{ id?: string }>;
}
