import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BookingStatus, Payment, PaymentStatus } from '@prisma/client';

import { ConfigService } from '@nestjs/config';

import Razorpay from 'razorpay';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { createHmac, timingSafeEqual } from 'crypto';
import { VerifyPaymentDto } from './dto/verify-order.dto';
@Injectable()
export class PaymentService {
  private readonly razorpay: Razorpay;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');

    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (!keyId || !keySecret) {
      throw new Error('Razorpay API keys are not configured.');
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const booking = await this.findBooking(createOrderDto.bookingId);

    this.validateBookingOwnership(booking.userId, userId);

    this.validateBookingStatus(booking.status, booking.paymentStatus);

    await this.validatePaymentExpiry(booking);

    const payment = await this.findPayment(booking.id);

    if (payment.razorpayOrderId) {
      return this.buildOrderResponse(booking, payment.razorpayOrderId);
    }

    const razorpayOrder = await this.createRazorpayOrder(
      booking.id,
      booking.totalAmount,
    );

    await this.saveRazorpayOrderId(payment.id, razorpayOrder.id);

    return this.buildOrderResponse(booking, razorpayOrder.id);
  }

  private async findBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    return booking;
  }

async verifyPayment(  
  verifyPaymentDto: VerifyPaymentDto,
  userId: string,
) {
  const booking = await this.findBooking(
    verifyPaymentDto.bookingId,
  );

  this.validateBookingOwnership(
    booking.userId,
    userId,
  );

  const payment = await this.findPayment(
    booking.id,
  );

  if (
    booking.status ===
      BookingStatus.CONFIRMED &&
    payment.status === PaymentStatus.SUCCESS
  ) {
    return {
      message: 'Payment already verified.',
      bookingId: booking.id,
      bookingStatus: booking.status,
      paymentStatus: payment.status,
    };
  }

  this.validateBookingStatus(
    booking.status,
    booking.paymentStatus,
  );

  this.validateRazorpayOrder(
    payment.razorpayOrderId,
    verifyPaymentDto.razorpayOrderId,
  );

  const isSignatureValid =
    this.verifyRazorpaySignature(
      payment.razorpayOrderId!,
      verifyPaymentDto.razorpayPaymentId,
      verifyPaymentDto.razorpaySignature,
    );

  if (!isSignatureValid) {
    throw new BadRequestException(
      'Invalid payment signature.',
    );
  }

  await this.confirmPayment(
    booking.id,
    payment.id,
    verifyPaymentDto,
  );

  return {
    message: 'Payment verified successfully.',
    bookingId: booking.id,
    bookingStatus: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.SUCCESS,
  };
}
  private validateBookingOwnership(
    bookingUserId: string,
    userId: string,
  ): void {
    if (bookingUserId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to make payment for this booking.',
      );
    }
  }
  private validateBookingStatus(
    bookingStatus: BookingStatus,
    paymentStatus: PaymentStatus,
  ): void {
    if (paymentStatus === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment has already been completed.');
    }

    if (bookingStatus !== BookingStatus.PENDING_PAYMENT) {
      throw new BadRequestException('This booking is not ready for payment.');
    }
  }
  private async validatePaymentExpiry(booking: {
    id: string;
    paymentExpiresAt: Date | null;
  }): Promise<void> {
    if (!booking.paymentExpiresAt) {
      throw new BadRequestException(
        'Payment expiry is not configured for this booking.',
      );
    }

    const now = new Date();

    if (booking.paymentExpiresAt <= now) {
      await this.expireBooking(booking.id);

      throw new BadRequestException(
        'Payment window has expired. Please create a new booking.',
      );
    }
  }
  private async findPayment(bookingId: string): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({
      where: {
        bookingId,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found.');
    }

    return payment;
  }
  private async createRazorpayOrder(bookingId: string, amount: number) {
    const amountInPaise = Math.round(amount * 100);

    return this.razorpay.orders.create({
      amount: amountInPaise,

      currency: 'INR',

      receipt: bookingId,
    });
  }
  private async saveRazorpayOrderId(
    paymentId: string,
    razorpayOrderId: string,
  ): Promise<void> {
    await this.prisma.payment.update({
      where: {
        id: paymentId,
      },

      data: {
        razorpayOrderId,
      },
    });
  }
  private buildOrderResponse(
    booking: {
      id: string;
      totalAmount: number;
      paymentExpiresAt: Date | null;
    },
    razorpayOrderId: string,
  ) {
    return {
      message: 'Payment order created successfully.',

      bookingId: booking.id,

      razorpayOrderId,

      amount: Math.round(booking.totalAmount * 100),

      currency: 'INR',

      paymentExpiresAt: booking.paymentExpiresAt,
    };
  }
  private async expireBooking(bookingId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.booking.update({
        where: {
          id: bookingId,
        },

        data: {
          status: BookingStatus.PAYMENT_EXPIRED,

          paymentStatus: PaymentStatus.EXPIRED,
        },
      }),

      this.prisma.payment.update({
        where: {
          bookingId,
        },

        data: {
          status: PaymentStatus.EXPIRED,
        },
      }),
    ]);
  }

  private validateRazorpayOrder(
  storedOrderId: string | null,
  receivedOrderId: string,
): void {
  if (!storedOrderId) {
    throw new BadRequestException(
      'Razorpay order has not been created.',
    );
  }

  if (storedOrderId !== receivedOrderId) {
    throw new BadRequestException(
      'Razorpay order ID does not match.',
    );
  }
}
private verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): boolean {
  const keySecret =
    this.configService.get<string>(
      'RAZORPAY_KEY_SECRET',
    );

  if (!keySecret) {
    throw new Error(
      'Razorpay key secret is not configured.',
    );
  }

  const payload =
    `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature = createHmac(
    'sha256',
    keySecret,
  )
    .update(payload)
    .digest('hex');

  const expectedBuffer = Buffer.from(
    expectedSignature,
    'utf8',
  );

  const receivedBuffer = Buffer.from(
    razorpaySignature,
    'utf8',
  );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer,
  );
}
private async confirmPayment(
  bookingId: string,
  paymentId: string,
  verifyPaymentDto: VerifyPaymentDto,
): Promise<void> {
  await this.prisma.$transaction([
    this.prisma.payment.update({
      where: {
        id: paymentId,
      },

      data: {
        razorpayPaymentId:
          verifyPaymentDto.razorpayPaymentId,

        razorpaySignature:
          verifyPaymentDto.razorpaySignature,

        status: PaymentStatus.SUCCESS,
      },
    }),

    this.prisma.booking.update({
      where: {
        id: bookingId,
      },

      data: {
        status: BookingStatus.CONFIRMED,

        paymentStatus:
          PaymentStatus.SUCCESS,
      },
    }),
  ]);
}

}
