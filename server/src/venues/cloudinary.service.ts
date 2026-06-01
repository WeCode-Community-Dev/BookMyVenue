import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isConfigured = true;
      this.logger.log('Cloudinary successfully configured for venue image storage.');
    } else {
      this.logger.warn(
        'Cloudinary credentials are not configured in your environment. Falling back to DB-backed Base64 image storage.',
      );
    }
  }

  /**
   * Uploads a single image to Cloudinary (or returns the base64 string as fallback).
   */
  async uploadImage(base64Image: string): Promise<string> {
    if (!this.isConfigured) {
      return base64Image;
    }

    try {
      // Cloudinary natively parses data:image/...;base64,... strings!
      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: 'bookmyvenue',
        quality: 'auto',       // Automatic quality optimization (reduces file size ~40-60%)
        format: 'auto',        // Auto-converts to WebP/AVIF for supported browsers
        transformation: [
          { width: 1200, crop: 'limit' }, // Cap max width at 1200px (sufficient for all views)
        ],
      });
      return uploadResult.secure_url;
    } catch (error) {
      this.logger.error(
        `Failed to upload image to Cloudinary: ${error.message}. Storing as base64 instead.`,
      );
      return base64Image;
    }
  }

  /**
   * Uploads multiple images in parallel.
   */
  async uploadImages(images: string[]): Promise<string[]> {
    if (!images || images.length === 0) {
      return [];
    }

    const uploadPromises = images.map((image) => {
      // If the image is already a Cloudinary/HTTP URL (from seed data or existing venue), skip re-uploading!
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return Promise.resolve(image);
      }
      return this.uploadImage(image);
    });

    return Promise.all(uploadPromises);
  }
}
