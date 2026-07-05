import { ApiProperty } from '@nestjs/swagger';

export class UploadedFileInfoDto {
  @ApiProperty({ example: 'venue-1688012345678-123456789.jpg' })
  fileName: string;

  @ApiProperty({ example: 'venue.jpg' })
  originalName: string;

  @ApiProperty({
    example: '/uploads/venue-images/venue-1688012345678-123456789.jpg',
  })
  imageUrl: string;
}

export class UploadVenueImagesResponseDto {
  @ApiProperty({ example: 'Images uploaded successfully.' })
  message: string;

  @ApiProperty({ type: [UploadedFileInfoDto] })
  images: UploadedFileInfoDto[];
}

export class UploadedDocumentInfoDto {
  @ApiProperty({ example: 'venue-doc-1688012345678-123456789.pdf' })
  fileName: string;

  @ApiProperty({ example: 'registration.pdf' })
  originalName: string;

  @ApiProperty({
    example: '/uploads/venue-documents/venue-doc-1688012345678-123456789.pdf',
  })
  documentUrl: string;
}

export class UploadVenueDocumentsResponseDto {
  @ApiProperty({ example: 'Documents uploaded successfully.' })
  message: string;

  @ApiProperty({ type: [UploadedDocumentInfoDto] })
  documents: UploadedDocumentInfoDto[];
}

export class UploadProfilePictureResponseDto {
  @ApiProperty({ example: 'Profile picture uploaded successfully.' })
  message: string;

  @ApiProperty({ example: 'profile-1688012345678-123456789.png' })
  fileName: string;

  @ApiProperty({ example: 'profile.png' })
  originalName: string;

  @ApiProperty({
    example: '/uploads/profile-images/profile-1688012345678-123456789.png',
  })
  imageUrl: string;
}
