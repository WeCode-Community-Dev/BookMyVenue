import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VenueType } from '../../common/enums/venue-type.enum';
import { VenueStatus } from '../../common/enums/venue-status.enum';
import { BookingType } from '../../common/enums/booking-type.enum';
import { VenueImage } from './venue-image.entity';

import { VenueDocument } from './venue-document.entity';
import { VenueVerificationRequest } from './venue-verification-request.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ─── Owner ─────────────────────────────────────────────────────────────────

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  // ─── Basic Info ────────────────────────────────────────────────────────────

  @Column({ name: 'venue_name', type: 'varchar', length: 255 })
  venueName: string;

  @Column({ type: 'enum', enum: VenueType })
  venueType: VenueType;

  @Column({ type: 'text' })
  description: string;

  // ─── Location ──────────────────────────────────────────────────────────────

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  district: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 20 })
  pincode: string;
  // ─── Capacity ──────────────────────────────────────────────────────────────

  @Column({ name: 'max_capacity', type: 'int' })
  maxCapacity: number;

  @Column({ name: 'square_feet', type: 'int' })
  squareFeet: number;

  // ─── Parking ───────────────────────────────────────────────────────────────

  @Column({ name: 'has_parking', type: 'boolean', default: false })
  hasParking: boolean;

  @Column({ name: 'parking_capacity', type: 'int', nullable: true })
  parkingCapacity: number | null;

  // ─── Pricing & Booking ─────────────────────────────────────────────────────

  @Column({ name: 'starting_price', type: 'decimal', precision: 12, scale: 2 })
  startingPrice: number;

  @Column({ name: 'booking_type', type: 'enum', enum: BookingType })
  bookingType: BookingType;

  // ─── Status ────────────────────────────────────────────────────────────────

  @Column({
    type: 'enum',
    enum: VenueStatus,
    default: VenueStatus.DRAFT,
  })
  status: VenueStatus;

  // ─── Onboarding Step Tracking ──────────────────────────────────────────────
  // Each boolean is set true by the service when minimum requirements are met.
  // canSubmit = all four are true AND status IN ['DRAFT', 'CHANGES_REQUESTED']

  @Column({ name: 'step_venue_info_done', type: 'boolean', default: false })
  stepVenueInfoDone: boolean;

  @Column({ name: 'step_photos_done', type: 'boolean', default: false })
  stepPhotosDone: boolean;

  @Column({ name: 'step_facilities_done', type: 'boolean', default: false })
  stepFacilitiesDone: boolean;

  @Column({ name: 'step_documents_done', type: 'boolean', default: false })
  stepDocumentsDone: boolean;

  // ─── Relations ─────────────────────────────────────────────────────────────

  @OneToMany(() => VenueImage, (image) => image.venue, { cascade: true })
  images: VenueImage[];


  @OneToMany(() => VenueDocument, (doc) => doc.venue, { cascade: true })
  documents: VenueDocument[];

  @OneToMany(() => VenueVerificationRequest, (req) => req.venue)
  verificationRequests: VenueVerificationRequest[];

  // ─── Timestamps ────────────────────────────────────────────────────────────

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
