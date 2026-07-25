import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { StorageService } from './storage.service';
import {
  UploadProfilePictureResponseDto,
  UploadVenueDocumentsResponseDto,
  UploadVenueImagesResponseDto,
} from './dto/upload-response.dto';

import {
  venueImageMulterOptions,
  venueDocumentMulterOptions,
  profilePictureMulterOptions,
} from './multer.config';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('venue-images')
  @ApiOperation({ summary: 'Upload venue images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload up to 10 venue image files',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Images uploaded successfully.',
    type: UploadVenueImagesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FilesInterceptor('images', 10, venueImageMulterOptions))
  uploadVenueImages(@UploadedFiles() files: any[]) {
    return this.storageService.uploadVenueImages(files);
  }

  @Post('venue-documents')
  @ApiOperation({ summary: 'Upload venue documents' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload up to 5 venue document files',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        documents: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Documents uploaded successfully.',
    type: UploadVenueDocumentsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FilesInterceptor('documents', 5, venueDocumentMulterOptions))
  uploadVenueDocuments(@UploadedFiles() files: any[]) {
    return this.storageService.uploadVenueDocuments(files);
  }

  @Post('profile-picture')
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a single profile image file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Profile picture uploaded successfully.',
    type: UploadProfilePictureResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('image', profilePictureMulterOptions))
  uploadProfilePicture(@UploadedFile() file: any) {
    return this.storageService.uploadProfilePicture(file);
  }
}
