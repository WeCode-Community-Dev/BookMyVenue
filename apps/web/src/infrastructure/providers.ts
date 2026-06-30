// Client-side provider singletons.
// This is the SINGLE place the web app picks its auth + storage adapters.
// To swap providers, replace the factory calls below — call sites stay the same.

import { makeBetterAuthProvider } from "@repo/infrastructure";
import type { AuthProvider, StorageProvider } from "@repo/contracts";
import { authClient } from "@/lib/auth-client";

// ---- Auth ----
// Uses Better Auth — sessions managed via cookies.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authProvider: AuthProvider = makeBetterAuthProvider(authClient as any);

// ---- Storage ----
// Uses Cloudflare R2 via storage API endpoints.
export const storageProvider: StorageProvider = {
  getPublicUrl(bucket, path) {
    return `/api/storage/public/${bucket}/${path}`;
  },

  async createSignedUploadUrl() {
    throw new Error("Presigned upload URLs are not used. Use storageProvider.upload instead.");
  },

  async createSignedDownloadUrl(bucket, path) {
    return {
      url: `/api/storage/private/${bucket}/${path}`,
      method: "GET",
      expiresIn: 3600,
    };
  },

  async upload(bucket, path, file) {
    const formData = new FormData();
    formData.append("bucket", bucket);
    formData.append("path", path);
    const blobValue = file instanceof Blob ? file : new Blob([file as any]);
    formData.append("file", blobValue);

    const res = await fetch("/api/storage/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${await res.text()}`);
    }

    const data = (await res.json()) as { path: string };
    return data;
  },

  async delete(bucket, paths) {
    const res = await fetch("/api/storage/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bucket, paths }),
    });

    if (!res.ok) {
      throw new Error(`Delete failed: ${await res.text()}`);
    }
  },
};
