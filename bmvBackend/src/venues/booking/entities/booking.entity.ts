import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venues/entities/venue.entity';
export enum BookingStatus {
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    EXPIRED = 'EXPIRED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum CancelledBy {
    CUSTOMER = 'CUSTOMER',
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    //   SYSTEM = 'SYSTEM',
}

@Entity('bookings')
// Index to prevent double-booking active reservations
@Index('UQ_venue_active_booking_date', ['venueId', 'bookingDate'], {
    unique: true,
    where: `"booking_status" IN ('PENDING_PAYMENT', 'CONFIRMED')`,
})
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    bookingId: string;

    @Column({ name: 'booking_reference', type: 'varchar', length: 50, unique: true })
    bookingReference: string;

    @Column({ name: 'customer_id', type: 'uuid' })
    customerId: string;

    @ManyToOne(() => User, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'customer_id' })
    customer: User;

    @Column({ name: 'venue_id', type: 'uuid' })
    venueId: string;

    @ManyToOne(() => Venue, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'venue_id' })
    venue: Venue;

    @Column({ name: 'booking_date', type: 'date' })
    bookingDate: Date | string; // Store as 'YYYY-MM-DD' formatted string or date

    @Column({
        name: 'booking_status',
        type: 'enum',
        enum: BookingStatus,
        // default: BookingStatus.CONFIRMED,
    })
    bookingStatus: BookingStatus;

    @Column({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PAID,
    })
    paymentStatus: PaymentStatus;

    // ─── Financials ────────────────────────────────────────────────────────────
    @Column({ name: 'base_amount', type: 'decimal', precision: 12, scale: 2 })
    baseAmount: number;

    @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
    totalAmount: number;

    @Column({ name: 'refund_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    refundAmount: number;

    @Column({ name: 'payment_gateway_ref', type: 'varchar', length: 255, nullable: true })
    paymentGatewayRef: string | null;

    // ─── Cancellation Info ──────────────────────────────────────────────────────
    @Column({ name: 'cancelled_at', type: 'timestamp with time zone', nullable: true })
    cancelledAt: Date | null;

    @Column({ name: 'cancelled_by', type: 'enum', enum: CancelledBy, nullable: true })
    cancelledBy: CancelledBy | null;

    @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
    cancellationReason: string | null;

    // ─── Customer Requests ──────────────────────────────────────────────────────
    @Column({ name: 'special_request', type: 'text', nullable: true })
    specialRequest: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({
        type: 'timestamptz',
        nullable: true
    })
    lockedUntil: Date | null;
}
