// Provider-agnostic DB client factory.
// Repos receive an opaque `Db` handle; the factory decides what it is
// (Supabase client, Drizzle/D1 instance, Prisma client, etc.).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DbHandle = any;

export interface DbClientFactory {
  /** Service-role / admin handle (bypasses row-level security). */
  admin(): DbHandle;
  /** Per-request handle scoped to the caller's auth token. */
  forUser(accessToken: string): DbHandle;
}
