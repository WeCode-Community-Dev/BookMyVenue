import { sqliteTable, text, integer, real, unique } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Better Auth - User table (DB table "profiles" to maintain backward compatibility)
export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at_auth", { mode: "timestamp" }).notNull(), // standard Better Auth field
  updatedAt: integer("updated_at_auth", { mode: "timestamp" }).notNull(), // standard Better Auth field

  // Custom Fields (mapped from signup metadata)
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role"),
  isSuspended: integer("is_suspended", { mode: "boolean" }).notNull().default(false),

  // Legacy created_at and updated_at timestamps for profiles
  created_at: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// Better Auth - Session table (DB table "sessions")
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
});

// Better Auth - Account table (DB table "accounts")
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Better Auth - Verification table (DB table "verifications")
export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// User Roles table (DB table "user_roles")
export const userRoles = sqliteTable(
  "user_roles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    role: text("role").notNull(), // customer, host, admin
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    userRoleUnique: unique("user_role_unique").on(t.userId, t.role),
  }),
);

// Venues table (DB table "venues")
export const venues = sqliteTable("venues", {
  id: text("id").primaryKey(),
  hostId: text("host_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  venueType: text("venue_type").notNull(), // wedding, conference, party, celebration, other
  capacity: integer("capacity").notNull(),
  basePriceCents: integer("base_price_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  addressData: text("address_data").notNull().default("{}"), // stored as JSON string
  amenities: text("amenities").notNull().default("[]"), // stored as JSON string
  coverImageUrl: text("cover_image_url"),
  galleryUrls: text("gallery_urls").notNull().default("[]"), // stored as JSON string
  pricingMode: text("pricing_mode").notNull().default("per_hour"), // per_hour, per_day, flat, per_person
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  isSuspended: integer("is_suspended", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// Coupons table (DB table "coupons")
export const coupons = sqliteTable("coupons", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  venueId: text("venue_id").references(() => venues.id, { onDelete: "cascade" }),
  discountType: text("discount_type").notNull(), // percentage, fixed_amount
  discountValue: real("discount_value").notNull(),
  validFrom: text("valid_from")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  validUntil: text("valid_until"),
  usageLimit: integer("usage_limit"),
  timesUsed: integer("times_used").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdBy: text("created_by").references(() => profiles.id, { onDelete: "set null" }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// Bookings table (DB table "bookings")
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  venueId: text("venue_id")
    .notNull()
    .references(() => venues.id, { onDelete: "restrict" }),
  customerId: text("customer_id").references(() => profiles.id, { onDelete: "cascade" }),
  couponId: text("coupon_id").references(() => coupons.id, { onDelete: "set null" }),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  guestCount: integer("guest_count"),
  subtotalCents: integer("subtotal_cents").notNull(),
  discountAmountCents: integer("discount_amount_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, expired
  expiresAt: text("expires_at"),
  version: integer("version").notNull().default(1),
  notes: text("notes"),
  stripeSessionId: text("stripe_session_id"),
  source: text("source").notNull().default("online"), // online, offline, block_off
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  paymentMethod: text("payment_method"), // cash, bank_transfer, card_offline, online, other
  amountPaidCents: integer("amount_paid_cents").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// Payments table (DB table "payments")
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  gateway: text("gateway").notNull().default("stripe"),
  transactionId: text("transaction_id").unique(),
  orderId: text("order_id"),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"), // pending, success, failed
  gatewayResponse: text("gateway_response"), // stored as JSON string
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// Venue Reviews table (DB table "venue_reviews")
export const venueReviews = sqliteTable(
  "venue_reviews",
  {
    id: text("id").primaryKey(),
    venueId: text("venue_id")
      .notNull()
      .references(() => venues.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    feedback: text("feedback"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    venueReviewUnique: unique("venue_review_unique").on(t.venueId, t.userId),
  }),
);

// Invoices table (DB table "invoices")
export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .unique()
    .references(() => bookings.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  pdfPath: text("pdf_path").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull(),
  issuedAt: text("issued_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  sentAt: text("sent_at"),
  recipientEmail: text("recipient_email"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// Cache table (DB table "api_cache")
export const apiCache = sqliteTable("api_cache", {
  key: text("key").primaryKey(),
  payload: text("payload").notNull(), // stored as JSON string
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
