/**
 * SAMPLE adapter — Cloudflare R2 implementation of StorageProvider.
 *
 * R2 is S3-compatible, so this re-uses the AWS SDK pointed at R2's endpoint.
 * In a Cloudflare Worker you can alternatively bind the bucket directly via
 * `env.MY_BUCKET.put(...)`; that variant is shown commented below.
 *
 * To activate:
 *   1. `bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
 *   2. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
 *   3. Swap the provider in the composition root
 */

import type { SignedUrl, StorageProvider, UploadResult } from "@repo/contracts";

export interface R2StorageConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Public r2.dev URL or custom domain for `getPublicUrl`. */
  publicBaseUrl?: string;
}

export function makeR2StorageProvider(cfg: R2StorageConfig): StorageProvider {
  // TODO: import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectsCommand }
  //       from "@aws-sdk/client-s3";
  // TODO: import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  // const s3 = new S3Client({
  //   region: "auto",
  //   endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
  //   credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
  // });

  return {
    getPublicUrl(_bucket, path) {
      const base = cfg.publicBaseUrl ?? "";
      return `${base.replace(/\/$/, "")}/${path}`;
    },
    async createSignedUploadUrl(_bucket, _path): Promise<SignedUrl> {
      throw new Error("R2: createSignedUploadUrl not implemented (sample)");
    },
    async createSignedDownloadUrl(_bucket, _path, _expiresIn = 3600): Promise<SignedUrl> {
      throw new Error("R2: createSignedDownloadUrl not implemented (sample)");
    },
    async upload(_bucket, _path): Promise<UploadResult> {
      // Worker binding alternative:
      //   await env.MY_BUCKET.put(_path, _file, { httpMetadata: { contentType } });
      throw new Error("R2: upload not implemented (sample)");
    },
    async delete(_bucket, _paths) {
      throw new Error("R2: delete not implemented (sample)");
    },
  };
}
