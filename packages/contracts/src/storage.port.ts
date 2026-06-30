// Provider-agnostic object-storage port.
// Implementations live in @repo/infrastructure/storage/*.

export interface SignedUrl {
  url: string;
  method: "GET" | "PUT" | "POST";
  headers?: Record<string, string>;
  expiresIn: number;
}

export interface UploadResult {
  path: string;
}

export interface StorageProvider {
  /** Public URL for objects in a public bucket. */
  getPublicUrl(bucket: string, path: string): string;

  /** Pre-signed URL the client uses to PUT a file directly to storage. */
  createSignedUploadUrl(
    bucket: string,
    path: string,
    opts?: { contentType?: string; expiresIn?: number },
  ): Promise<SignedUrl>;

  /** Pre-signed URL for downloading a private object. */
  createSignedDownloadUrl(bucket: string, path: string, expiresIn?: number): Promise<SignedUrl>;

  /** Server-side direct upload (e.g. from a webhook handler). */
  upload(
    bucket: string,
    path: string,
    file: Blob | ArrayBuffer | Uint8Array,
    opts?: { contentType?: string; upsert?: boolean },
  ): Promise<UploadResult>;

  delete(bucket: string, paths: string[]): Promise<void>;
}
