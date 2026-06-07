import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Review } from '../../reviews/entities/review.entity';
import { BookingLock } from '../../booking-locks/entities/booking-lock.entity';
import { VenueBlockedDate } from './venue-blocked-date.entity';

export enum VenueType {
  BIRTHDAY_HALL = 'birthday_hall',
  AUDITORIUM = 'auditorium',
  CAFE = 'cafe',
  RESORT = 'resort',
  HOTEL = 'hotel',
  MEETUP_SPACE = 'meetup_space',
  BANQUET_HALL = 'banquet_hall',
  CONFERENCE_ROOM = 'conference_room',
  OUTDOOR_SPACE = 'outdoor_space',
  OTHER = 'other',
}

export enum VenueStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.venues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ length: 200 })
  venueName: string;

  @Column({ type: 'enum', enum: VenueType })
  venueType: VenueType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500 })
  address: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerHour: number;

  @Column({ type: 'jsonb', default: [] })
  amenities: string[];

  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @Column({ type: 'double precision', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'enum', enum: VenueStatus, default: VenueStatus.APPROVED })
  status: VenueStatus;

  @Column({ type: 'jsonb', default: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] })
  workingDays: string[];

  @Column({ type: 'time', nullable: true })
  openingTime: string;

  @Column({ type: 'time', nullable: true })
  closingTime: string;

  @OneToMany(() => Booking, (booking) => booking.venue)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.venue)
  reviews: Review[];

  @OneToMany(() => BookingLock, (lock) => lock.venue)
  bookingLocks: BookingLock[];

  @OneToMany(() => VenueBlockedDate, (blocked) => blocked.venue)
  blockedDates: VenueBlockedDate[];

  @Column({ type: 'text', nullable: true })
  suspensionReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
