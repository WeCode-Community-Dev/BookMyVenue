import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { Venue } from 'src/venues/entities/venue.entity';

@Entity('venue_blocked_dates')
// Index to optimize querying blocked dates by venue and date range
@Index('IDX_venue_blocked_date_range', ['venueId', 'startDate', 'endDate'])
export class VenueBlockedDate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'venue_id', type: 'uuid' })
    venueId: string;

    @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'venue_id' })
    venue: Venue;

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date | string;

    @Column({ name: 'end_date', type: 'date' })
    endDate: Date | string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    reason: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}

