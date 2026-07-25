import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'bookmyvenue_venues',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload returned empty result'));
          resolve(result.secure_url);
        },
      );
      
      uploadStream.end(file.buffer);
    });
  }
}