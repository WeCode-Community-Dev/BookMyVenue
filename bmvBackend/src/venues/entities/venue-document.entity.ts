import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Venue } from './venue.entity';
import { DocumentType } from '../../common/enums/document-type.enum';
import { DocumentStatus } from '../../common/enums/document-status.enum';

@Entity('venue_documents')
export class VenueDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'venue_id', type: 'uuid' })
  venueId: string;

  @ManyToOne(() => Venue, (venue) => venue.documents, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @Column({ name: 'document_type', type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  /** Full Cloudinary secure URL — restricted, only shown to admin and the owner. */
  @Column({ name: 'document_url', type: 'text' })
  documentUrl: string;

  /**
   * Cloudinary public_id — used for deletion.
   * e.g. venues/{venueId}/documents/{cloudinary-id}
   */
  @Column({ name: 'file_key', type: 'text' })
  fileKey: string;

  @Column({
    name: 'verification_status',
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  verificationStatus: DocumentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
