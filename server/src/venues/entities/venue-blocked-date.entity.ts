import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venue } from './venue.entity';
import { User } from '../../users/entities/user.entity';

@Entity('venue_blocked_dates')
export class VenueBlockedDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  venueId: string;

  @ManyToOne(() => Venue, (venue) => venue.blockedDates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @Column({ type: 'date' })
  blockedDate: string;

  @Column({ length: 255, nullable: true })
  reason: string;

  @Column({ nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @CreateDateColumn()
  createdAt: Date;
}
