import { IsEnum } from 'class-validator';
import { DocumentType } from '../../common/enums/document-type.enum';

/**
 * Used for multipart/form-data document upload.
 * The actual file comes via the `file` field (FileInterceptor).
 * This DTO covers the additional form fields.
 */
export class AddVenueDocumentDto {
  @IsEnum(DocumentType, {
    message: `documentType must be one of: ${Object.values(DocumentType).join(', ')}`,
  })
  documentType: DocumentType;
}
