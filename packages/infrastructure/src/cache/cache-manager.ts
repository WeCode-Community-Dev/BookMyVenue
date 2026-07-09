import type { CacheNamespace, CacheStore } from "@repo/contracts";
import { makeDrizzleCacheStore } from "../drizzle/cache";
import { makeCloudflareKvCacheStore } from "./cloudflare-kv.cache";
import { makeUpstashCacheStore } from "./upstash.cache";

export interface CacheManagerConfig {
  provider?: string; // "cloudflare-kv" | "drizzle" | "upstash"
  drizzleDb?: any;
  kv?: any;
  upstashUrl?: string;
  upstashToken?: string;
}

export class CacheStoreManager implements CacheStore {
  private delegate: CacheStore;

  constructor(config: CacheManagerConfig) {
    const provider = config.provider || this.detectProvider(config);

    switch (provider) {
      case "cloudflare-kv":
        this.delegate = makeCloudflareKvCacheStore({ kv: config.kv });
        break;
      case "upstash":
        this.delegate = makeUpstashCacheStore({
          url: config.upstashUrl || "",
          token: config.upstashToken || "",
        });
        break;
      case "drizzle":
      default:
        this.delegate = makeDrizzleCacheStore({ adminDb: config.drizzleDb });
        break;
    }
  }

  private detectProvider(config: CacheManagerConfig): string {
    if (config.kv) return "cloudflare-kv";
    if (config.upstashUrl && config.upstashToken) return "upstash";
    return "drizzle";
  }

  async get(ns: CacheNamespace, key: string): Promise<unknown | null> {
    return this.delegate.get(ns, key);
  }

  async set(ns: CacheNamespace, key: string, value: unknown, ttlSeconds: number): Promise<void> {
    return this.delegate.set(ns, key, value, ttlSeconds);
  }

  async invalidateNamespace(ns: CacheNamespace): Promise<void> {
    return this.delegate.invalidateNamespace(ns);
  }
}
