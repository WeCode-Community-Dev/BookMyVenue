// Auth adapters
export { makeCognitoAuthProvider } from "./auth/cognito.auth";
export type { CognitoAuthConfig } from "./auth/cognito.auth";
export { makeCloudflareAccessAuthProvider } from "./auth/cloudflare.auth";
export type { CloudflareAccessConfig } from "./auth/cloudflare.auth";
export { makeBetterAuthProvider } from "./auth/better-auth.auth";
export type { BetterAuthClient } from "./auth/better-auth.auth";

// Storage adapters
export { makeR2BindingStorageProvider } from "./storage/r2.storage";
export type {
  R2BindingStorageConfig,
  R2BucketLike,
  R2ObjectBodyLike,
} from "./storage/r2.storage";
export { makeR2InvoiceStorage } from "./storage/r2-invoice.storage";
export type { R2InvoiceStorageConfig } from "./storage/r2-invoice.storage";

// DB factories
export { makeDrizzleD1Factory } from "./db/drizzle-d1-db";
export type { DrizzleD1Deps } from "./db/drizzle-d1-db";
export * from "./drizzle";

// Cache adapters
export { makeDrizzleCacheStore } from "./drizzle/cache";
export { makeUpstashCacheStore } from "./cache/upstash.cache";
export type { UpstashConfig } from "./cache/upstash.cache";
export { makeCloudflareKvCacheStore } from "./cache/cloudflare-kv.cache";
export type { CloudflareKvConfig } from "./cache/cloudflare-kv.cache";
export { CacheStoreManager } from "./cache/cache-manager";
export type { CacheManagerConfig } from "./cache/cache-manager";

// Invoice PDF rendering
export { makePdfLibInvoiceRenderer } from "./pdf/invoice.renderer";

// Email adapters
export { makeResendEmailSender } from "./email/resend.sender";
export type { ResendEmailSenderConfig } from "./email/resend.sender";

// HTTP/REST adapters (primarily for mobile/native clients)
export * from "./http/mobile-rest";
