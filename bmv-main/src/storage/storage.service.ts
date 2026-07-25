import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class StorageService {
  uploadVenueImages(files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'No images uploaded.',
      );
    }

    return {
      message: 'Images uploaded successfully.',
      images: files.map((file) => ({
        originalName: file.originalname,
        fileName: file.filename,
        imageUrl: `/uploads/venue/${file.filename}`,
      })),
    };
  }

  uploadVenueDocuments(files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'No documents uploaded.',
      );
    }

    return {
      message: 'Documents uploaded successfully.',
      documents: files.map((file) => ({
        originalName: file.originalname,
        fileName: file.filename,
        documentUrl: `/uploads/venues/${file.filename}`,
      })),
    };
  }

  uploadProfilePicture(file: any) {
    if (!file) {
      throw new BadRequestException(
        'No profile picture uploaded.',
      );
    }

    return {
      message: 'Profile picture uploaded successfully.',
      originalName: file.originalname,
      fileName: file.filename,
      imageUrl: `/uploads/profiles/${file.filename}`,
    };
  }
}