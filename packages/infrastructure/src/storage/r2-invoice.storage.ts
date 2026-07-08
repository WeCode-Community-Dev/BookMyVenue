/**
 * R2-backed InvoiceStorage implementation.
 *
 * Uses a native R2Bucket binding (Cloudflare Workers) to store and
 * retrieve invoice PDFs from a private bucket.
 */

import type { InvoiceStorage } from "@repo/contracts";
import type { R2BucketLike } from "./r2.storage";

export interface R2InvoiceStorageConfig {
  /** The R2 bucket binding for invoices. */
  bucket: R2BucketLike;
  /**
   * URL prefix for download links served through the API route.
   * Defaults to "/api/storage/private/invoices".
   */
  downloadUrlPrefix?: string;
}

export function makeR2InvoiceStorage(cfg: R2InvoiceStorageConfig): InvoiceStorage {
  const prefix = (cfg.downloadUrlPrefix ?? "/api/storage/private/invoices").replace(/\/$/, "");

  return {
    async upload(path: string, bytes: Uint8Array): Promise<{ path: string }> {
      // Copy into a plain ArrayBuffer to satisfy the R2BucketLike type
      const ab = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(ab).set(bytes);

      await cfg.bucket.put(path, ab, {
        httpMetadata: { contentType: "application/pdf" },
      });
      return { path };
    },

    async createSignedDownloadUrl(path: string, _expiresInSeconds = 3600): Promise<string> {
      // With direct bindings there are no real signed URLs.
      // Return the API proxy path that enforces auth + ACL checks.
      return `${prefix}/${path}`;
    },
  };
}
