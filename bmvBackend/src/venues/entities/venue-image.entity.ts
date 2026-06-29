import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Venue } from './venue.entity';
import { ImageType } from '../../common/enums/image-type.enum';

@Entity('venue_images')
export class VenueImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'venue_id', type: 'uuid' })
  venueId: string;

  @ManyToOne(() => Venue, (venue) => venue.images, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  /** Full Cloudinary secure URL returned to clients. */
  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string;

  /**
   * Cloudinary public_id — used for deletion.
   * e.g. venues/{venueId}/images/{cloudinary-id}
   */
  @Column({ name: 'file_key', type: 'text' })
  fileKey: string;

  @Column({ name: 'image_type', type: 'enum', enum: ImageType })
  imageType: ImageType;

  /** Controls display order on the frontend (lower = first). */
  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
