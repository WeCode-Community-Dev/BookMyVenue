import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ImageType } from '../../common/enums/image-type.enum';

/**
 * Used for multipart/form-data image upload.
 * The actual file comes via the `file` field (FileInterceptor).
 * This DTO covers the additional form fields.
 */
export class AddVenueImageDto {
  @IsEnum(ImageType, {
    message: `imageType must be one of: ${Object.values(ImageType).join(', ')}`,
  })
  imageType: ImageType;

  /** Optional display order — lower numbers appear first. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  displayOrder?: number;
}
