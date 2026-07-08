/**
 * Cloudflare R2 implementation of StorageProvider.
 *
 * Uses native R2Bucket bindings available in Cloudflare Workers.
 * This is the preferred adapter when running on Workers.
 */

import type { SignedUrl, StorageObject, StorageProvider, UploadResult } from "@repo/contracts";

// ────────────────────────────────────────────────────────────
// Native R2 Bucket binding approach (Workers runtime)
// ────────────────────────────────────────────────────────────

/**
 * R2Bucket-like interface. We declare a minimal subset so the infrastructure
 * package doesn't depend on `@cloudflare/workers-types` directly.
 */
export interface R2BucketLike {
  put(
    key: string,
    value: ArrayBuffer | ReadableStream | string | Blob | null,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<R2ObjectBodyLike | null>;
  delete(keys: string | string[]): Promise<void>;
}

export interface R2ObjectBodyLike {
  body: ReadableStream;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2BindingStorageConfig {
  /** Map of logical bucket names → R2 bucket bindings. */
  buckets: Record<string, R2BucketLike>;
  /**
   * Base path prefix used by `getPublicUrl`.
   * Defaults to "/api/storage/public".
   */
  publicUrlPrefix?: string;
}

export function makeR2BindingStorageProvider(cfg: R2BindingStorageConfig): StorageProvider {
  function resolveBucket(name: string): R2BucketLike {
    const bucket = cfg.buckets[name];
    if (!bucket) {
      throw new Error(`R2BindingStorage: no bucket binding for "${name}"`);
    }
    return bucket;
  }

  const prefix = (cfg.publicUrlPrefix ?? "/api/storage/public").replace(/\/$/, "");

  return {
    getPublicUrl(bucket, path) {
      return `${prefix}/${bucket}/${path}`;
    },

    async createSignedUploadUrl(_bucket, _path) {
      throw new Error(
        "R2BindingStorage: createSignedUploadUrl is not supported. Use upload() instead.",
      );
    },

    async createSignedDownloadUrl(bucket, path, expiresIn = 3600) {
      // With direct bindings there are no pre-signed URLs.
      // Return a server-side proxy path that the API route can serve.
      return {
        url: `/api/storage/private/${bucket}/${path}`,
        method: "GET" as const,
        expiresIn,
      };
    },

    async getObject(bucket, path) {
      const r2 = resolveBucket(bucket);
      const obj = await r2.get(path);
      if (!obj) return null;
      return {
        body: obj.body,
        httpEtag: obj.httpEtag,
        writeHttpMetadata: (headers: Headers) => obj.writeHttpMetadata(headers),
      };
    },

    async upload(bucket, path, file, opts) {
      const r2 = resolveBucket(bucket);
      const arrayBuffer =
        file instanceof ArrayBuffer
          ? file
          : file instanceof Blob
            ? await file.arrayBuffer()
            : new Uint8Array(file as Uint8Array).buffer as ArrayBuffer;

      await r2.put(path, arrayBuffer, {
        httpMetadata: {
          contentType: opts?.contentType ?? "application/octet-stream",
        },
      });

      return { path };
    },

    async delete(bucket, paths) {
      const r2 = resolveBucket(bucket);
      await Promise.all(paths.map((p) => r2.delete(p)));
    },
  };
}
