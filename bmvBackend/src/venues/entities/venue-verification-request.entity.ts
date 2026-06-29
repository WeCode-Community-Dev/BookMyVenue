import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Venue } from './venue.entity';
import { User } from '../../users/entities/user.entity';
import { VerificationStatus } from '../../common/enums/verification-status.enum';

/**
 * Each submission by the venue owner creates a new row.
 * Full audit history is preserved across re-submissions.
 *
 * Current status = row with highest submission_number for a given venue_id.
 *
 * Partial unique constraint (enforced at DB level via migration / sync):
 *   UNIQUE (venue_id) WHERE status = 'PENDING'
 *   → Only one open submission allowed per venue at a time.
 *
 * REJECTED is terminal — owner cannot re-submit after rejection.
 */
@Entity('venue_verification_requests')
@Index(['venueId', 'submissionNumber'])
export class VenueVerificationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'venue_id', type: 'uuid' })
  venueId: string;

  @ManyToOne(() => Venue, (venue) => venue.verificationRequests, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @Column({ name: 'submitted_by', type: 'uuid' })
  submittedBy: string;

  @ManyToOne(() => User, { eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'submitted_by' })
  submitter: User;

  /**
   * Increments with each submission attempt.
   * First submission → 1, after CHANGES_REQUESTED → 2, etc.
   */
  @Column({ name: 'submission_number', type: 'int', default: 1 })
  submissionNumber: number;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  /** Admin notes — populated when status changes to CHANGES_REQUESTED or REJECTED. */
  @Column({ name: 'review_notes', type: 'text', nullable: true })
  reviewNotes: string | null;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedBy: string | null;

  @ManyToOne(() => User, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User | null;

  @CreateDateColumn({ name: 'submitted_at' })
  submittedAt: Date;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date | null;
}
