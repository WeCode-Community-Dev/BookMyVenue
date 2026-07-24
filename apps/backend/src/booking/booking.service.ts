import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BookingStatus, VenueStatus } from '@prisma/client';

import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { IdempotencyService } from './idempotency/idempotency.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RazorpayService } from 'src/providers/razorpay/razorpay-service';
import { SlotLockService } from './slot-lock/slot-lock.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class BookingService {
  constructor(
    // Database access
    private readonly prismaService: PrismaService,

    // Razorpay integration (will be used later)
    private readonly razorpayService: RazorpayService,

    // Prevent duplicate requests
    private readonly idempotencyService: IdempotencyService,

    // Prevent multiple users booking the same slot simultaneously
    private readonly slotLockService: SlotLockService,
  ) {}

  async createBooking(
    dto: CreateBookingDto,
    userId: string,
    idempotencyKey: string,
  ) {
    // ----------------------------------------------------
    // STEP 1 : Verify that the requested venue exists
    // ----------------------------------------------------

    const venue = await this.prismaService.venue.findUnique({
      where: {
        id: dto.venueId,
      },
    });

    if (!venue) {
      throw new BadRequestException('Venue not found.');
    }

    // ----------------------------------------------------
    // STEP 2 : Only approved venues can be booked
    // ----------------------------------------------------

    if (venue.status !== VenueStatus.APPROVED) {
      throw new BadRequestException('This venue is not available for booking.');
    }

    // ----------------------------------------------------
    // STEP 3 : Venue owner may temporarily disable bookings
    // ----------------------------------------------------

    if (!venue.isActive) {
      throw new BadRequestException('This venue is currently inactive.');
    }

    // ----------------------------------------------------
    // STEP 4 : Extract all selected pricing tier IDs
    // Example:
    //
    // Morning Slot -> Tier A
    // Evening Slot -> Tier C
    //
    // We'll fetch them in one database query.
    // ----------------------------------------------------

    const slotPricingIds = dto.slots.map((slot) => slot.slotPricingTierId);

    // ----------------------------------------------------
    // STEP 5 : Fetch all pricing tiers
    // Also include the Slot Template because
    // we'll need it later.
    // ----------------------------------------------------

    const pricingTiers = await this.prismaService.venueSlotPricing.findMany({
      where: {
        id: {
          in: slotPricingIds,
        },
      },
      include: {
        slotTemplate: true,
      },
    });

    // ----------------------------------------------------
    // STEP 6 : Validate that every selected tier exists
    //
    // If user selected 3 slots,
    // database should return 3 pricing tiers.
    // ----------------------------------------------------

    if (pricingTiers.length !== dto.slots.length) {
      throw new BadRequestException(
        'One or more selected slot pricing tiers are invalid.',
      );
    }

    // ----------------------------------------------------
    // STEP 7 : Verify all selected tiers belong
    // to this venue.
    //
    // Prevents someone sending
    // pricing tier IDs from another venue.
    // ----------------------------------------------------

    for (const pricingTier of pricingTiers) {
      if (pricingTier.slotTemplate.venueId !== venue.id) {
        throw new BadRequestException('Invalid slot pricing tier selected.');
      }
    }

    // ----------------------------------------------------
    // STEP 8 : Extract all booking dates
    //
    // We'll use these to check blocked dates.
    // ----------------------------------------------------

    const eventDates = dto.slots.map((slot) => new Date(slot.eventDate));

    // ----------------------------------------------------
    // STEP 9 : Fetch owner's blocked dates
    //
    // Example:
    // Offline booking
    // Personal event
    // Maintenance
    // ----------------------------------------------------

    const blockedDates = await this.prismaService.venueBlockedDate.findMany({
      where: {
        venueId: venue.id,
      },
    });

    // ----------------------------------------------------
    // STEP 10 : Ensure every selected date
    // is available.
    // ----------------------------------------------------

    for (const eventDate of eventDates) {
      const isBlocked = blockedDates.some(
        (blockedDate) =>
          eventDate >= blockedDate.fromDate && eventDate <= blockedDate.toDate,
      );

      if (isBlocked) {
        throw new BadRequestException(
          'Selected date is blocked by the venue owner.',
        );
      }
    }

    // ----------------------------------------------------
    // STEP 11 : Idempotency
    //
    // Every booking request must contain
    // an Idempotency-Key.
    // ----------------------------------------------------

    if (!idempotencyKey) {
      throw new BadRequestException('Missing Idempotency-Key header.');
    }

    // ----------------------------------------------------
    // STEP 12 : Check whether this request
    // has already been processed.
    //
    // If yes,
    // return cached response.
    //
    // Prevents duplicate bookings.
    // ----------------------------------------------------

    const cachedResponse =
      await this.idempotencyService.getCachedResponse(idempotencyKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    // ----------------------------------------------------
    // STEP 13 : Store successfully acquired locks.
    //
    // If any later lock fails,
    // we'll release everything.
    // ----------------------------------------------------

    const acquiredLocks: {
      slotPricingTierId: string;
      eventDate: string;
    }[] = [];

    // ----------------------------------------------------
    // STEP 14 : Lock every selected slot.
    //
    // Prevent two users booking
    // the same slot simultaneously.
    // ----------------------------------------------------

    for (const slot of dto.slots) {
      const acquired = await this.slotLockService.acquireLock(
        venue.id,
        slot.slotPricingTierId,
        slot.eventDate,
      );

      // ------------------------------------------------
      // If one lock fails,
      // release all previous locks.
      // ------------------------------------------------

      if (!acquired) {
        for (const lockedSlot of acquiredLocks) {
          await this.slotLockService.releaseLock(
            venue.id,
            lockedSlot.slotPricingTierId,
            lockedSlot.eventDate,
          );
        }

        throw new ConflictException(
          'One or more selected slots are temporarily locked. Please try again.',
        );
      }

      // ------------------------------------------------
      // Save acquired lock.
      // ------------------------------------------------

      acquiredLocks.push({
        slotPricingTierId: slot.slotPricingTierId,
        eventDate: slot.eventDate,
      });
    }

    // ----------------------------------------------------
    // STEP 15 : Calculate total booking price.
    //
    // Since the frontend already sends the selected
    // pricing tier IDs, simply sum their prices.
    // ----------------------------------------------------

    let totalPrice = 0;

    for (const pricingTier of pricingTiers) {
      totalPrice += Number(pricingTier.price);
    }
    // Start Prisma Transaction

    try {
      const response = await this.prismaService.$transaction(async (tx) => {
        // ---------------------------------------------
        // STEP 16.1 : Create Booking
        // ---------------------------------------------

        const booking = await tx.booking.create({
          data: {
            userId,
            venueId: venue.id,
            totalPrice,
            status: BookingStatus.PENDING_PAYMENT,
            cancellationEligible: true,
          },
        });

        // ---------------------------------------------
        // STEP 16.2 : Create Booked Slot records
        // ---------------------------------------------

        for (const slot of dto.slots) {
          const pricingTier = pricingTiers.find(
            (tier) => tier.id === slot.slotPricingTierId,
          );

          if (!pricingTier) {
            throw new BadRequestException('Invalid pricing tier.');
          }

          try {
            await tx.bookedSlot.create({
              data: {
                bookingId: booking.id,
                slotTemplateId: pricingTier.slotTemplate.id,
                slotPricingTierId: pricingTier.id,
                eventDate: new Date(slot.eventDate),
                occupiedFrom: new Date(slot.eventDate),
                occupiedTo: new Date(slot.eventDate),
                slotPrice: pricingTier.price,
              },
            });
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.code === 'P2002'
            ) {
              throw new ConflictException('Selected slot is already booked.');
            }

            throw error;
          }
        }

        // ---------------------------------------------
        // STEP 16.3 : Return booking
        // ---------------------------------------------

        return booking;
      });

      // STEP 17
      // Create Razorpay Order
      const razorpayOrder = await this.razorpayService.createOrder(
        totalPrice * 100,
        response.id,
        {
          bookingId: response.id,
          venueId: venue.id,
          userId,
        },
      );

      // STEP 18
      // Update Booking with Razorpay Order Id

      await this.prismaService.booking.update({
        where: {
          id: response.id,
        },
        data: {
          razorpayOrderId: razorpayOrder.id,
        },
      });

      // STEP 19
      // Cache Idempotency Response

      await this.idempotencyService.cacheResponse(idempotencyKey, {
        bookingId: response.id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalPrice,
      });

      // STEP 20
      // Release Redis Locks

      for (const lockedSlot of acquiredLocks) {
        await this.slotLockService.releaseLock(
          venue.id,
          lockedSlot.slotPricingTierId,
          lockedSlot.eventDate,
        );
      }

      // STEP 21
      //   return response;

      return {
        bookingId: response.id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalPrice,
        currency: 'INR',
      };
      // Return Response
    } catch (error) {
      // Release Redis Locks

      for (const lockedSlot of acquiredLocks) {
        await this.slotLockService.releaseLock(
          venue.id,
          lockedSlot.slotPricingTierId,
          lockedSlot.eventDate,
        );
      }

      throw error;
    }
  }

  async verifyPayment(dto: VerifyPaymentDto, userId: string) {
    // ----------------------------------------------------
    // STEP 1 : Find booking using Razorpay Order ID
    // ----------------------------------------------------

    const booking = await this.prismaService.booking.findUnique({
      where: {
        razorpayOrderId: dto.razorpayOrderId,
      },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found.');
    }

    // ----------------------------------------------------
    // STEP 2 : Verify booking belongs to logged-in user
    // ----------------------------------------------------

    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to verify this booking.',
      );
    }

    // ----------------------------------------------------
    // STEP 3 : Booking should still be pending payment
    // ----------------------------------------------------

    if (booking.status !== BookingStatus.PENDING_PAYMENT) {
      throw new BadRequestException('This booking has already been processed.');
    }

    // ----------------------------------------------------
    // STEP 4 : Verify Razorpay Signature
    // ----------------------------------------------------

    const isSignatureValid = this.razorpayService.verifyPaymentSignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );

    if (!isSignatureValid) {
      throw new BadRequestException('Invalid payment signature.');
    }

    // ----------------------------------------------------
    // STEP 5 : Mark booking as confirmed
    // ----------------------------------------------------

    const updatedBooking = await this.prismaService.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: BookingStatus.CONFIRMED,
        razorpayPaymentId: dto.razorpayPaymentId,
        confirmedAt: new Date(),
      },
    });

    // ----------------------------------------------------
    // STEP 6 : Return success response
    // ----------------------------------------------------

    return {
      success: true,
      message: 'Payment verified successfully.',
      bookingId: updatedBooking.id,
      paymentId: updatedBooking.razorpayPaymentId,
      status: updatedBooking.status,
    };
  }

  async cancelBooking(dto: CancelBookingDto, userId: string) {
    // STEP 1
    // Find booking
    const booking = await this.prismaService.booking.findUnique({
      where: {
        id: dto.bookingId,
      },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found.');
    }
    // STEP 2
    // Verify ownership
    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to cancel this booking.',
      );
    }
    // STEP 3
    // Check booking status

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled.');
    }

    if (booking.status === BookingStatus.REFUNDED) {
      throw new BadRequestException('Booking has already been refunded.');
    }

    if (booking.status === BookingStatus.EXPIRED) {
      throw new BadRequestException('Booking has already expired.');
    }

    // ----------------------------------------------------
    // STEP 4 : Refund payment if booking is confirmed
    // ----------------------------------------------------

    if (
      booking.status === BookingStatus.CONFIRMED &&
      !booking.razorpayPaymentId
    ) {
      throw new BadRequestException('Payment information is missing.');
    }

    const refund =
      booking.status === BookingStatus.CONFIRMED
        ? await this.razorpayService.refundPayment(
            booking.razorpayPaymentId!,
            Number(booking.totalPrice) * 100,
          )
        : null;

    // ----------------------------------------------------
    // STEP 5 : Update booking status
    // ----------------------------------------------------

    const updatedBooking = await this.prismaService.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status:
          booking.status === BookingStatus.CONFIRMED
            ? BookingStatus.REFUNDED
            : BookingStatus.CANCELLED,

        cancelledAt: new Date(),

        razorpayRefundId: refund?.id ?? null,
      },
    });

    // STEP 6
    // Return response
    return {
      success: true,
      message:
        updatedBooking.status === BookingStatus.REFUNDED
          ? 'Booking cancelled and refunded successfully.'
          : 'Booking cancelled successfully.',
      bookingId: updatedBooking.id,
      status: updatedBooking.status,
    };
  }

  async getUserBookings(userId: string) {
    return this.prismaService.booking.findMany({
      where: {
        userId,
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            addressLine: true,
            city: true,
            images: {
              where: {
                isPrimary: true,
              },
              take: 1,
            },
          },
        },
        slots: {
          include: {
            slotTemplate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
