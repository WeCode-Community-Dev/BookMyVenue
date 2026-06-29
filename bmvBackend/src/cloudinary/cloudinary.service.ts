import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

export interface CloudinaryUploadResult {
  /** Cloudinary public_id — store this as the "fileKey" for later deletion. */
  publicId: string;
  /** Fully-qualified secure URL to the asset. */
  secureUrl: string;
}

@Injectable()
export class CloudinaryService {
  /**
   * Uploads an image buffer to Cloudinary under
   * `venues/{venueId}/images` and transforms it to WebP.
   */
  async uploadImage(
    buffer: Buffer,
    venueId: string,
  ): Promise<CloudinaryUploadResult> {
    return this.uploadBuffer(buffer, {
      folder: `venues/${venueId}/images`,
      resource_type: 'image',
      format: 'webp',
      quality: 'auto:good',
    });
  }

  /**
   * Uploads a document buffer (PDF, etc.) to Cloudinary under
   * `venues/{venueId}/documents` as a raw resource.
   */
  async uploadDocument(
    buffer: Buffer,
    venueId: string,
  ): Promise<CloudinaryUploadResult> {
    return this.uploadBuffer(buffer, {
      folder: `venues/${venueId}/documents`,
      resource_type: 'raw',
    });
  }

  /**
   * Deletes an image asset from Cloudinary by its public_id.
   */
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  }

  /**
   * Deletes a raw (document) asset from Cloudinary by its public_id.
   */
  async deleteDocument(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  private uploadBuffer(
    buffer: Buffer,
    options: Record<string, unknown>,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error || !result) {
            return reject(
              new BadRequestException(
                error?.message ?? 'Cloudinary upload failed.',
              ),
            );
          }
          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
          });
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }
}
