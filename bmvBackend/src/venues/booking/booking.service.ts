import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Between, DataSource, LessThanOrEqual, MoreThanOrEqual, LessThan } from 'typeorm';
import { Booking, BookingStatus, CancelledBy, PaymentStatus } from './entities/booking.entity';
import { CancelBookingDto, CreateBookingDto, VerifyPaymentDto, CancelPaymentDto, MockPayDto } from './dto/booking.dto';
import { Venue } from '../entities/venue.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { VenueBlockedDate } from '../entities/venue-blocked-date.entity';
import { CreateVenueBlockedDateRangeDto } from '../dto/venue-block.dto';
import { User } from 'src/users/entities/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly BookingRepo: Repository<Booking>,
        @InjectRepository(Venue)
        private readonly VenueRepo: Repository<Venue>,
        @InjectRepository(VenueBlockedDate)
        private readonly VenueBlockedRepo: Repository<VenueBlockedDate>,
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
    ) { }

    async createBooking(dto: CreateBookingDto, customerId: string): Promise<any> {
        const { venueId, bookingDate, specialRequest } = dto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const venue = await queryRunner.manager.findOne(Venue, {
                where: { id: venueId }
            });
            if (!venue) {
                throw new NotFoundException("The venue is not found");
            }

            // Check if the venue is blocked by the owner for this date
            const isBlocked = await queryRunner.manager.findOne(VenueBlockedDate, {
                where: {
                    venueId: venueId,
                    startDate: LessThanOrEqual(bookingDate),
                    endDate: MoreThanOrEqual(bookingDate),
                }
            });
            if (isBlocked) {
                throw new ConflictException("The venue is blocked by the owner for selected Date");
            }

            const existingBooking = await queryRunner.manager.findOne(Booking, {
                where: {
                    venueId: venueId,
                    bookingDate: bookingDate,
                }
            });

            if (existingBooking) {
                if (existingBooking.bookingStatus === BookingStatus.CONFIRMED) {
                    throw new ConflictException("The venue is already booked for selected Date");
                }

                if (existingBooking.bookingStatus === BookingStatus.PENDING_PAYMENT) {
                    const now = new Date();
                    if (existingBooking.lockedUntil && existingBooking.lockedUntil > now) {
                        throw new ConflictException("The venue is temporarily reserved");
                    } else {
                        // Lock expired, mark the old one as EXPIRED to release database unique index constraint
                        existingBooking.bookingStatus = BookingStatus.EXPIRED;
                        existingBooking.paymentStatus = PaymentStatus.FAILED;
                        existingBooking.lockedUntil = null;
                        await queryRunner.manager.save(existingBooking);
                    }
                }
            }

            const dateStr = typeof bookingDate === 'string'
                ? bookingDate.replace(/-/g, '')
                : new Date(bookingDate).toISOString().split('T')[0].replace(/-/g, '');
            const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
            const bookingReference = `BMV-${dateStr}-${randomSuffix}`;
            const price = Number(venue.startingPrice);

            const newBooking = queryRunner.manager.create(Booking, {
                bookingReference,
                customerId,
                venueId,
                bookingDate,
                specialRequest,
                bookingStatus: BookingStatus.PENDING_PAYMENT,
                paymentStatus: PaymentStatus.PENDING,
                baseAmount: price,
                totalAmount: price,
                lockedUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes lock
            });

            const savedBooking = await queryRunner.manager.save(newBooking);
            await queryRunner.commitTransaction();

            // Create Mock Razorpay Order ID outside the transaction
            const mockOrderId = `order_${crypto.randomUUID()}`;
            savedBooking.paymentGatewayRef = mockOrderId;
            await this.BookingRepo.save(savedBooking);

            return {
                bookingId: savedBooking.bookingId,
                bookingReference: savedBooking.bookingReference,
                orderId: mockOrderId,
                amount: savedBooking.totalAmount,
                lockedUntil: savedBooking.lockedUntil,
            };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            // Catch database unique constraint violation
            if (err.code === '23505') {
                throw new ConflictException("The venue is temporarily reserved or booked");
            }
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async cancelBooking(dto: CancelBookingDto, bookingId: string, UserId: string, userRole: UserRole): Promise<Booking> {
        const { cancellationReason } = dto;

        const booking = await this.BookingRepo.findOne({
            where: {
                bookingId: bookingId
            }
        })
        if (!booking) {
            throw new NotFoundException("The venue is not booked")
        }
        if (booking.bookingStatus === BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking has already been cancelled.");
        }
        if (userRole === UserRole.CUSTOMER) {
            if (booking.customerId != UserId) {
                throw new ForbiddenException("You are not authorized to cancel this booking.");
            }
            booking.cancelledBy = CancelledBy.CUSTOMER;

        }
        else if (userRole === UserRole.VENUE_OWNER) {
            const venue = await this.VenueRepo.findOne({
                where: {
                    id: booking.venueId
                }
            })

            if (!venue || venue.ownerId !== UserId) {
                throw new ForbiddenException("You are not authorized to cancel bookings for this venue.");
            }
            booking.cancelledBy = CancelledBy.OWNER
        }
        else if (userRole === UserRole.ADMIN) {
            booking.cancelledBy = CancelledBy.ADMIN;
        }


        booking.bookingStatus = BookingStatus.CANCELLED;
        booking.paymentStatus = PaymentStatus.REFUNDED;
        booking.cancellationReason = cancellationReason;
        booking.cancelledAt = new Date();
        booking.refundAmount = Number(booking.totalAmount); // Fully refund the amount
        // 5. Save the updated entity
        return await this.BookingRepo.save(booking);
    }

    async getCustomerBookings(customerId: string): Promise<Booking[]> {
        return this.BookingRepo.find({
            where: { customerId },
            relations: ['venue', 'venue.images'],
            order: { createdAt: 'DESC' },
        });
    }

    async verifyPayment(dto: VerifyPaymentDto, customerId: string): Promise<any> {
        const { orderId, paymentId, signature } = dto;

        const booking = await this.BookingRepo.findOne({
            where: { paymentGatewayRef: orderId }
        });

        if (!booking) {
            throw new NotFoundException("Booking not found");
        }

        // Ownership validation (IDOR prevention)
        if (booking.customerId !== customerId) {
            throw new ForbiddenException("You are not authorized to access this booking");
        }

        // Idempotency check: Already confirmed
        if (booking.bookingStatus === BookingStatus.CONFIRMED) {
            return { success: true, bookingId: booking.bookingId };
        }

        // Verify Razorpay signature: HMAC-SHA256(orderId + "|" + paymentId, secret)
        const secret = this.configService.get<string>('RAZORPAY_SECRET', 'mock_secret');
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        if (signature !== expectedSignature) {
            throw new BadRequestException("Invalid payment signature");
        }

        // Handle Late payment verification scenario:
        // If booking lock expired or failed, we must check if another user booked it in the meantime.
        if (booking.bookingStatus === BookingStatus.EXPIRED || booking.bookingStatus === BookingStatus.PAYMENT_FAILED) {
            const conflictingBooking = await this.BookingRepo.createQueryBuilder('b')
                .where('b.venueId = :venueId', { venueId: booking.venueId })
                .andWhere('b.bookingDate = :bookingDate', { bookingDate: booking.bookingDate })
                .andWhere('b.bookingStatus IN (:...statuses)', { statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING_PAYMENT] })
                .getOne();

            let conflictExists = false;
            if (conflictingBooking && conflictingBooking.bookingId !== booking.bookingId) {
                if (conflictingBooking.bookingStatus === BookingStatus.CONFIRMED) {
                    conflictExists = true;
                } else if (conflictingBooking.bookingStatus === BookingStatus.PENDING_PAYMENT) {
                    const now = new Date();
                    if (conflictingBooking.lockedUntil && conflictingBooking.lockedUntil > now) {
                        conflictExists = true;
                    }
                }
            }

            // If another booking is active, we cannot confirm this expired booking. It must be refunded.
            if (conflictExists) {
                booking.paymentStatus = PaymentStatus.REFUNDED;
                await this.BookingRepo.save(booking);
                return {
                    success: false,
                    bookingId: booking.bookingId,
                    message: "Late payment received but slot is already taken. Refund initiated."
                };
            }
        }

        booking.bookingStatus = BookingStatus.CONFIRMED;
        booking.paymentStatus = PaymentStatus.PAID;
        booking.lockedUntil = null;
        booking.paymentGatewayRef = paymentId;

        await this.BookingRepo.save(booking);

        return { success: true, bookingId: booking.bookingId };
    }

    async cancelPayment(dto: CancelPaymentDto, customerId: string): Promise<any> {
        const { orderId } = dto;

        const booking = await this.BookingRepo.findOne({
            where: { paymentGatewayRef: orderId }
        });

        if (!booking) {
            throw new NotFoundException("Booking not found");
        }

        // Ownership validation
        if (booking.customerId !== customerId) {
            throw new ForbiddenException("You are not authorized to access this booking");
        }

        if (booking.bookingStatus === BookingStatus.CONFIRMED) {
            throw new BadRequestException("Cannot cancel an already confirmed booking");
        }

        booking.bookingStatus = BookingStatus.PAYMENT_FAILED;
        booking.paymentStatus = PaymentStatus.FAILED;
        booking.lockedUntil = null;

        await this.BookingRepo.save(booking);

        return { success: true, bookingId: booking.bookingId };
    }

    async simulateMockPay(dto: MockPayDto, customerId: string): Promise<any> {
        const { orderId, status } = dto;

        const booking = await this.BookingRepo.findOne({
            where: { paymentGatewayRef: orderId }
        });

        if (!booking) {
            throw new NotFoundException("Booking not found");
        }

        // Ownership validation
        if (booking.customerId !== customerId) {
            throw new ForbiddenException("You are not authorized to access this booking");
        }

        if (booking.bookingStatus === BookingStatus.CONFIRMED) {
            throw new BadRequestException("Booking is already confirmed");
        }

        if (status === 'FAIL') {
            booking.bookingStatus = BookingStatus.PAYMENT_FAILED;
            booking.paymentStatus = PaymentStatus.FAILED;
            booking.lockedUntil = null;
            await this.BookingRepo.save(booking);
            return { success: false, message: "Payment simulation failed" };
        }

        const paymentId = `pay_${crypto.randomUUID()}`;
        const secret = this.configService.get<string>('RAZORPAY_SECRET', 'mock_secret');
        const signature = crypto
            .createHmac('sha256', secret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        return {
            orderId,
            paymentId,
            signature,
        };
    }

    /**
     * Get bookings placed on the partner's venue.
     */
    async getVenueBookings(ownerId: string): Promise<Booking[]> {
        const venue = await this.VenueRepo.findOne({
            where: { ownerId }
        });
        if (!venue) {
            throw new NotFoundException("Venue not found for this partner.");
        }
        return this.BookingRepo.find({
            where: { venueId: venue.id },
            relations: ['venue', 'venue.images', 'customer'],
            order: { createdAt: 'DESC' },
        });
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async cleanupExpiredBookings() {

        const now = new Date();
        await this.BookingRepo.createQueryBuilder()
            .update(Booking)
            .set({
                bookingStatus: BookingStatus.EXPIRED,
                paymentStatus: PaymentStatus.FAILED,
                lockedUntil: null
            })
            .where({
                bookingStatus: BookingStatus.PENDING_PAYMENT,
                lockedUntil: LessThan(now)
            })
            .execute();
    }
}


