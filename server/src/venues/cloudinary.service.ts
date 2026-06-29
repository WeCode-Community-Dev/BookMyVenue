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
      this.logger.log(`✅ Cloudinary configured (cloud: ${cloudName})`);
    } else {
      this.logger.warn(
        '⚠️ Cloudinary credentials missing. Falling back to DB-backed Base64 storage.',
      );
    }
  }

  /**
   * Uploads a single base64 image to Cloudinary.
   * Returns the secure URL on success.
   * Falls back to base64 only if Cloudinary is not configured.
   */
  async uploadImage(base64Image: string): Promise<string> {
    if (!this.isConfigured) {
      return base64Image;
    }

    // Determine resource type (image or video)
    const isVideo = base64Image.startsWith('data:video/');

    this.logger.log(
      `Uploading ${isVideo ? 'video' : 'image'} to Cloudinary (${Math.round(base64Image.length / 1024)}KB base64)...`,
    );

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: 'bookmyvenue',
      resource_type: isVideo ? 'video' : 'image',
      quality: 'auto',
      transformation: [{ width: 1200, crop: 'limit' }],
    });

    this.logger.log(`✅ Uploaded to Cloudinary: ${uploadResult.secure_url}`);
    return uploadResult.secure_url;
  }

  /**
   * Uploads multiple images in parallel.
   */
  async uploadImages(images: string[]): Promise<string[]> {
    if (!images || images.length === 0) {
      return [];
    }

    const uploadPromises = images.map((image) => {
      // Skip already-uploaded HTTP URLs
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return Promise.resolve(image);
      }
      return this.uploadImage(image);
    });

    return Promise.all(uploadPromises);
  }
}
