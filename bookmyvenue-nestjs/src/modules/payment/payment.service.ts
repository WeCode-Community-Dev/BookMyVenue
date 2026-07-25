import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    BookingStatus,
    PaymentProvider,
    PaymentStatus,
    Prisma,
} from '@prisma/client';
import Razorpay from 'razorpay';
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentService {
    private readonly razorpay: Razorpay;
    private readonly keyId: string;
    private readonly keySecret: string;
    private readonly currency: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        this.keyId = this.configService.getOrThrow<string>('RAZORPAY_KEY_ID');
        this.keySecret = this.configService.getOrThrow<string>('RAZORPAY_KEY_SECRET');
        this.currency = this.configService.get<string>('RAZORPAY_CURRENCY') ?? 'INR';

        this.razorpay = new Razorpay({
            key_id: this.keyId,
            key_secret: this.keySecret,
        });
    }

    async createOrder(bookingId: string, userId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: true,
                venue: true,
                slot: true,
                payments: {
                    where: { status: PaymentStatus.CREATED },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!booking) throw new NotFoundException('Booking not found.');
        if (booking.userId !== userId) throw new ForbiddenException('You do not have permission to pay for this booking.');
        if (booking.status !== BookingStatus.PENDING_PAYMENT) {
            throw new BadRequestException('This booking is not awaiting payment.');
        }
        if (booking.expiresAt && booking.expiresAt <= new Date()) {
            await this.expireBooking(booking.id);
            throw new BadRequestException('Booking payment window has expired.');
        }

        const existingPayment = booking.payments[0];
        if (existingPayment) {
            return {
                bookingId: booking.id,
                paymentId: existingPayment.id,
                keyId: this.keyId,
                amount: existingPayment.amount,
                currency: existingPayment.currency,
                razorpayOrderId: existingPayment.razorpayOrderId,
                bookingStatus: booking.status,
            };
        }

        const amount = Math.round(booking.totalPrice * 100);
        const receipt = `booking_${booking.id}`.slice(0, 40);

        const order = await this.razorpay.orders.create({
            amount,
            currency: this.currency,
            receipt,
            notes: {
                bookingId: booking.id,
                userId: booking.userId,
                slotId: booking.slotId,
                venueId: booking.venueId,
            },
        });

        const payment = await this.prisma.payment.create({
            data: {
                bookingId: booking.id,
                provider: PaymentProvider.RAZORPAY,
                status: PaymentStatus.CREATED,
                amount,
                currency: this.currency,
                receipt,
                razorpayOrderId: order.id,
            },
        });

        return {
            bookingId: booking.id,
            paymentId: payment.id,
            keyId: this.keyId,
            amount,
            currency: this.currency,
            razorpayOrderId: order.id,
            bookingStatus: booking.status,
            prefill: {
                name: booking.user.name,
                email: booking.user.email,
            },
            description: `${booking.venue.name} slot booking`,
        };
    }

    async verifyPayment(dto: VerifyPaymentDto, userId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { razorpayOrderId: dto.razorpay_order_id },
            include: { booking: true },
        });

        if (!payment) throw new NotFoundException('Payment order not found.');
        if (payment.booking.userId !== userId) {
            throw new ForbiddenException('You do not have permission to verify this payment.');
        }
        if (payment.status === PaymentStatus.CAPTURED || payment.booking.status === BookingStatus.CONFIRMED) {
            return this.prisma.payment.findUnique({
                where: { id: payment.id },
                include: this.paymentInclude,
            });
        }

        this.verifyCheckoutSignature(
            dto.razorpay_order_id,
            dto.razorpay_payment_id,
            dto.razorpay_signature,
        );

        const razorpayPayment = await this.razorpay.payments.fetch(dto.razorpay_payment_id);

        if (razorpayPayment.order_id !== dto.razorpay_order_id) {
            throw new BadRequestException('Payment order mismatch.');
        }

        if (razorpayPayment.status !== 'captured') {
            throw new BadRequestException('Payment is not captured yet.');
        }

        const paymentMethod = typeof razorpayPayment.method === 'string'
            ? razorpayPayment.method.toUpperCase()
            : 'ONLINE';

        return this.prisma.$transaction(
            async (tx) => {
                const currentPayment = await tx.payment.findUnique({
                    where: { id: payment.id },
                    include: { booking: true },
                });

                if (!currentPayment) throw new NotFoundException('Payment not found during verification.');

                await tx.payment.update({
                    where: { id: currentPayment.id },
                    data: {
                        status: PaymentStatus.CAPTURED,
                        razorpayPaymentId: dto.razorpay_payment_id,
                        razorpaySignature: dto.razorpay_signature,
                        method: paymentMethod,
                    },
                });

                await tx.booking.update({
                    where: { id: currentPayment.bookingId },
                    data: {
                        status: BookingStatus.CONFIRMED,
                        confirmedAt: new Date(),
                    },
                });

                return tx.payment.findUnique({
                    where: { id: currentPayment.id },
                    include: this.paymentInclude,
                });
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
    }

    private verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
        const expected = createHmac('sha256', this.keySecret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        const isValid =
            expected.length === signature.length &&
            timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

        if (!isValid) {
            throw new BadRequestException('Invalid payment signature.');
        }
    }

    private async expireBooking(bookingId: string) {
        await this.prisma.$transaction(async (tx) => {
            await tx.booking.update({
                where: { id: bookingId },
                data: { status: BookingStatus.EXPIRED },
            });

            await tx.payment.updateMany({
                where: {
                    bookingId,
                    status: PaymentStatus.CREATED,
                },
                data: {
                    status: PaymentStatus.CANCELLED,
                    failureReason: 'Booking expired before payment completion.',
                },
            });
        });
    }

    private readonly paymentInclude = {
        booking: {
            select: {
                id: true,
                status: true,
                totalPrice: true,
                bookedStartTime: true,
                bookedEndTime: true,
            },
        },
    } as const;
}