import type { CacheNamespace, CacheStore } from "@repo/contracts";

export interface CloudflareKvConfig {
  kv: any;
}

function fullKey(ns: CacheNamespace, key: string): string {
  return `${ns}:${key}`;
}

export function makeCloudflareKvCacheStore(cfg: CloudflareKvConfig): CacheStore {
  const kv = cfg.kv;
  return {
    async get(ns, key) {
      if (!kv) return null;
      try {
        const val = await kv.get(fullKey(ns, key));
        if (val === null) return null;
        return JSON.parse(val);
      } catch (err) {
        console.error("Cloudflare KV cache get error:", err);
        return null;
      }
    },

    async set(ns, key, value, ttlSeconds) {
      if (!kv) return;
      try {
        const k = fullKey(ns, key);
        const val = JSON.stringify(value);
        // Cloudflare KV expirationTtl must be at least 60 seconds.
        const expirationTtl = Math.max(60, ttlSeconds);
        await kv.put(k, val, { expirationTtl });
      } catch (err) {
        console.error("Cloudflare KV cache set error:", err);
      }
    },

    async invalidateNamespace(ns) {
      if (!kv) return;
      try {
        const prefix = `${ns}:`;
        let cursor: string | undefined = undefined;
        do {
          const list: { keys: { name: string }[]; list_complete: boolean; cursor?: string } =
            await kv.list({ prefix, cursor });
          const keys = list.keys;
          if (keys.length > 0) {
            await Promise.all(keys.map((k) => kv.delete(k.name)));
          }
          cursor = list.list_complete ? undefined : list.cursor;
        } while (cursor);
      } catch (err) {
        console.error("Cloudflare KV cache invalidateNamespace error:", err);
      }
    },
  };
}
