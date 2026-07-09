// Upstash REST Redis CacheStore — reference implementation.
// NOT WIRED. Swap in `composition-root.ts` once UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN are configured.

import type { CacheNamespace, CacheStore } from "@repo/contracts";

function fullKey(ns: CacheNamespace, key: string): string {
  return `${ns}:${key}`;
}

export interface UpstashConfig {
  url: string;
  token: string;
}

export function makeUpstashCacheStore(cfg: UpstashConfig): CacheStore {
  const base = cfg.url.replace(/\/$/, "");
  const headers = {
    Authorization: `Bearer ${cfg.token}`,
    "Content-Type": "application/json",
  };

  async function call<T = unknown>(command: (string | number)[]): Promise<T | null> {
    const res = await fetch(base, { method: "POST", headers, body: JSON.stringify(command) });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: T; error?: string };
    if (json.error) return null;
    return (json.result ?? null) as T | null;
  }

  return {
    async get(ns, key) {
      const raw = await call<string>(["GET", fullKey(ns, key)]);
      if (raw == null) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    },

    async set(ns, key, value, ttlSeconds) {
      await call(["SET", fullKey(ns, key), JSON.stringify(value), "EX", ttlSeconds]);
    },

    async invalidateNamespace(ns) {
      let cursor: string = "0";
      const match = `${ns}:*`;
      do {
        const result = await call<[string, string[]]>([
          "SCAN",
          cursor,
          "MATCH",
          match,
          "COUNT",
          200,
        ]);
        if (!result) return;
        cursor = result[0];
        const keys = result[1];
        if (keys.length > 0) await call(["DEL", ...keys]);
      } while (cursor !== "0");
    },
  };
}
