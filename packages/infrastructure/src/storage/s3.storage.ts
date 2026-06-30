/**
 * SAMPLE adapter — AWS S3 implementation of StorageProvider.
 *
 * Server-side adapter (Node / Worker compatible via aws-sdk v3).
 * For browser uploads, return a signed URL from a server function and PUT to it.
 *
 * To activate:
 *   1. `bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
 *   2. Configure CORS on the bucket for your app origin (PUT + GET)
 *   3. Swap the provider in the composition root
 */

import type { SignedUrl, StorageProvider, UploadResult } from "@repo/contracts";

export interface S3StorageConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Optional public CDN/base URL for `getPublicUrl`. */
  publicBaseUrl?: string;
}

export function makeS3StorageProvider(cfg: S3StorageConfig): StorageProvider {
  // TODO: import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectsCommand }
  //       from "@aws-sdk/client-s3";
  // TODO: import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  // const s3 = new S3Client({
  //   region: cfg.region,
  //   credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
  // });

  return {
    getPublicUrl(bucket, path) {
      const base = cfg.publicBaseUrl ?? `https://${bucket}.s3.${cfg.region}.amazonaws.com`;
      return `${base.replace(/\/$/, "")}/${path}`;
    },

    async createSignedUploadUrl(_bucket, _path, _opts): Promise<SignedUrl> {
      // const cmd = new PutObjectCommand({
      //   Bucket: _bucket, Key: _path, ContentType: _opts?.contentType,
      // });
      // const url = await getSignedUrl(s3, cmd, { expiresIn: _opts?.expiresIn ?? 3600 });
      // return { url, method: "PUT", expiresIn: _opts?.expiresIn ?? 3600 };
      throw new Error("S3: createSignedUploadUrl not implemented (sample)");
    },

    async createSignedDownloadUrl(_bucket, _path, _expiresIn = 3600): Promise<SignedUrl> {
      // const cmd = new GetObjectCommand({ Bucket: _bucket, Key: _path });
      // const url = await getSignedUrl(s3, cmd, { expiresIn: _expiresIn });
      // return { url, method: "GET", expiresIn: _expiresIn };
      throw new Error("S3: createSignedDownloadUrl not implemented (sample)");
    },

    async upload(_bucket, _path, _file, _opts): Promise<UploadResult> {
      // await s3.send(new PutObjectCommand({
      //   Bucket: _bucket, Key: _path, Body: _file as any, ContentType: _opts?.contentType,
      // }));
      // return { path: _path };
      throw new Error("S3: upload not implemented (sample)");
    },

    async delete(_bucket, _paths) {
      // await s3.send(new DeleteObjectsCommand({
      //   Bucket: _bucket, Delete: { Objects: _paths.map((Key) => ({ Key })) },
      // }));
      throw new Error("S3: delete not implemented (sample)");
    },
  };
}
