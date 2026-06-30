// Drizzle implementation of CacheStore using api_cache table in SQLite

import { eq, and, like, lt } from "drizzle-orm";
import type { CacheNamespace, CacheStore } from "@repo/contracts";
import { apiCache } from "./schema";

function fullKey(ns: CacheNamespace, key: string): string {
  return `${ns}:${key}`;
}

export function makeDrizzleCacheStore(deps: { adminDb: any }): CacheStore {
  const { adminDb } = deps;
  return {
    async get(ns, key) {
      const k = fullKey(ns, key);
      const rows = await adminDb
        .select({
          payload: apiCache.payload,
          expiresAt: apiCache.expiresAt,
        })
        .from(apiCache)
        .where(eq(apiCache.key, k))
        .limit(1);

      if (rows.length === 0) return null;

      const row = rows[0];
      if (new Date(row.expiresAt).getTime() < Date.now()) {
        await adminDb.delete(apiCache).where(eq(apiCache.key, k));
        return null;
      }

      return typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;
    },

    async set(ns, key, value, ttlSeconds) {
      const k = fullKey(ns, key);
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
      const payloadString = JSON.stringify(value);

      await adminDb
        .insert(apiCache)
        .values({
          key: k,
          payload: payloadString,
          expiresAt,
        })
        .onConflictDoUpdate({
          target: apiCache.key,
          set: {
            payload: payloadString,
            expiresAt,
          },
        });
    },

    async invalidateNamespace(ns) {
      await adminDb.delete(apiCache).where(like(apiCache.key, `${ns}:%`));
    },
  };
}
