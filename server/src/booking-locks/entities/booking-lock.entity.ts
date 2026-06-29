import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';
import { User } from '../../users/entities/user.entity';

export enum LockStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  USED = 'used',
  RELEASED = 'released',
}

@Entity('booking_locks')
export class BookingLock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  venueId: string;

  @ManyToOne(() => Venue, (venue) => venue.bookingLocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  lockedByUserId: string;

  @ManyToOne(() => User, (user) => user.bookingLocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lockedByUserId' })
  lockedByUser: User;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'enum', enum: LockStatus, default: LockStatus.ACTIVE })
  status: LockStatus;

  @CreateDateColumn()
  createdAt: Date;
}
