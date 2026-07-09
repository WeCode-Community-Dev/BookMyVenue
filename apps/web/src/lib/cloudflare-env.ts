// Cloudflare Workers environment bindings helper.
// Uses the `cloudflare:workers` module to access D1, R2, KV, and other bindings
// provided by @cloudflare/vite-plugin in both development and production.

// @ts-expect-error — cloudflare:workers is a virtual module provided by the Workers runtime
import { env as cfEnv } from "cloudflare:workers";

/**
 * Typed interface for all Cloudflare bindings declared in wrangler.jsonc.
 */
export interface CloudflareBindings {
  DB: any; // D1Database
  VENUE_IMAGES: any; // R2Bucket
  INVOICES: any; // R2Bucket
  CACHE_KV: any; // KVNamespace
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  RESEND_API_KEY?: string;
  TELEGRAM_API_KEY?: string;
}

/**
 * Get the Cloudflare environment bindings.
 * This returns the `env` object from `cloudflare:workers`, which provides
 * access to D1 databases, R2 buckets, KV namespaces, and secrets.
 */
export function getCloudflareEnv(): CloudflareBindings {
  return cfEnv as unknown as CloudflareBindings;
}
