import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

import { Injectable } from '@nestjs/common';

interface UploadedFile {
  buffer: Buffer;
}

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: UploadedFile,
    options?: {
      folder?: string;
      publicId?: string;
    },
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: options?.folder,
            public_id: options?.publicId,
          },
          (error, result) => {
            if (error instanceof Error) {
              return reject(error);
            }

            if (!result) {
              return reject(new Error('Cloudinary did not return a result.'));
            }

            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
