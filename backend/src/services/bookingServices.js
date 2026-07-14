import { db } from '../db/index.js';
import { bookingsTable } from '../models/bookingModel.js';
import { venuesTable } from '../models/venueModel.js';
import { paymentsTable } from '../models/paymentModel.js';
import { and, eq, ne, lte, gte, inArray } from 'drizzle-orm';
import pricingServices from './pricingServices.js';
import { AppError } from '../handlers/error_handlers.js';
import { StandardCheckoutPayRequest } from '@phonepe-pg/pg-sdk-node';
import { phonePeClient } from '../utils/phonepe.js';
import notificationService from './notificationService.js';

export default {
  checkAvailability: async function (venueId, monthParam) {
    const [year, month] = monthParam.split('-').map(Number);
    const monthStartStr = `${year}-${String(month).padStart(2, '0')}-01`;
    // "2026-06-01"

    const lastDay = new Date(year, month, 0).getDate(); // gets the day number e.g. 30
    const monthEndStr = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
    // "2026-06-30"

    const bookings = await db.query.bookingsTable.findMany({
      where: and(
        eq(bookingsTable.venueId, venueId),
        ne(bookingsTable.status, 'cancelled'),
        lte(bookingsTable.startDate, monthEndStr),
        gte(bookingsTable.endDate, monthStartStr)
      ),
      columns: {
        startDate: true,
        endDate: true,
        status: true,
      },
    });
    return bookings;
  },

  bookVenue: async function (bookerId, venueId, startDate, endDate, startTime, endTime, note) {
    const venueDetails = await pricingServices.priceCalc(
      venueId,
      startDate,
      endDate,
      startTime,
      endTime
    );

    const booking = await db.transaction(async (tx) => {
      if (venueDetails.venue.bookingType === 'daily') {
        const existingBooking = await tx.query.bookingsTable.findMany({
          where: and(
            eq(bookingsTable.venueId, venueId),
            ne(bookingsTable.status, 'cancelled'),
            lte(bookingsTable.startDate, endDate),
            gte(bookingsTable.endDate, startDate)
          ),
        });

        if (existingBooking.length > 0) {
          throw new AppError({
            message: 'Venue is Booked for this period',
            statusCode: 404,
            errorCode: 'VENUE_BOOKED',
          });
        }
      }

      if (venueDetails.venue.bookingType === 'hourly') {
        const existingBooking = await tx.query.bookingsTable.findMany({
          where: and(
            eq(bookingsTable.venueId, venueId),
            ne(bookingsTable.status, 'cancelled'),
            eq(bookingsTable.startDate, startDate),
            lte(bookingsTable.startTime, endTime),
            gte(bookingsTable.endTime, startTime)
          ),
        });

        if (existingBooking.length > 0) {
          throw new AppError({
            message: 'Venue is Booked for this period',
            statusCode: 404,
            errorCode: 'VENUE_BOOKED',
          });
        }
      }

      const [newBooking] = await tx
        .insert(bookingsTable)
        .values({
          venueId,
          bookerId,
          startDate,
          endDate,
          status: 'pending',
          totalAmount: venueDetails.totalAmount,
          pricingSnapshot: {
            breakdown: venueDetails.breakdown,
            totalAmount: venueDetails.totalAmount,
          },
          note,
          startTime,
          endTime,
        })
        .returning();

      const merchantOrderId = `booking_${newBooking.id}`;

      const orderRequest = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantOrderId)
        .amount(Math.round(venueDetails.totalAmount * 100)) // paisa
        .redirectUrl(`${process.env.FRONTEND_URL}/payments/verify?bookingId=${newBooking.id}`)
        .build();

      const phonePeResponse = await phonePeClient.pay(orderRequest);

      await tx.insert(paymentsTable).values({
        bookingId: newBooking.id,
        amount: venueDetails.totalAmount,
        status: 'pending',
        phonePeOrderId: merchantOrderId,
        phonePeTransactionId: phonePeResponse.orderId,
      });

      return {
        bookingId: newBooking.id,
        redirectUrl: phonePeResponse.redirectUrl, // frontend redirects user here
        totalAmount: venueDetails.totalAmount,
        breakdown: venueDetails.breakdown,
      };
    });

    return booking;
  },

  verifyPayment: async function (bookingId) {
    // 1. fetch payment row
    const payment = await db.query.paymentsTable.findFirst({
      where: eq(paymentsTable.bookingId, bookingId),
    });

    if (!payment)
      throw new AppError({
        message: 'Payment not found',
        statusCode: 404,
        errorCode: 'PAYMENT_NOT_FOUND',
      });

    // 2. check with PhonePe
    const statusResponse = await phonePeClient.getOrderStatus(payment.phonePeOrderId);

    // 3. handle result
    if (statusResponse.state === 'COMPLETED') {
      await db.transaction(async (tx) => {
        await tx
          .update(paymentsTable)
          .set({
            status: 'completed',
            phonePeTransactionRef: statusResponse.paymentDetails?.[0]?.transactionId,
            paidAt: new Date(),
          })
          .where(eq(paymentsTable.bookingId, bookingId));

        await tx
          .update(bookingsTable)
          .set({ status: 'confirmed' })
          .where(eq(bookingsTable.id, bookingId));
      });

      const booking = await db.query.bookingsTable.findFirst({
        where: eq(bookingsTable.id, bookingId),
        with: {
          venue: true, // gives you venue.ownerId directly
        },
      });

      await notificationService.createNotification({
        recipientId: booking.venue.ownerId,
        type: 'BOOKING_CONFIRMED',
        payload: {
          bookingId: booking.id,
          venueName: booking.venue.name,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalAmount: booking.totalAmount,
        },
      });

      return { status: 'confirmed' };
    }

    if (statusResponse.state === 'FAILED') {
      await db.transaction(async (tx) => {
        await tx
          .update(paymentsTable)
          .set({ status: 'failed' })
          .where(eq(paymentsTable.bookingId, bookingId));

        await tx
          .update(bookingsTable)
          .set({ status: 'cancelled' }) // ← frees up the dates
          .where(eq(bookingsTable.id, bookingId));
      });

      return { status: 'failed' };
    }

    return { status: 'pending' };
  },

  getUserBookings: async function (userId) {
    const result = await db.query.bookingsTable.findMany({
      where: eq(bookingsTable.bookerId, userId),
      with: {
        venue: {
          columns: {
            id: true,
            name: true,
            city: true,
            images: true,
            bookingType: true,
          },
        },
      },
      orderBy: (bookingsTable, { desc }) => [desc(bookingsTable.createdAt)],
    });
    return result;
  },

  getOwnerBookings: async function (ownerId) {
    const venues = await db.query.venuesTable.findMany({
      where: eq(venuesTable.ownerId, ownerId),
      columns: { id: true },
    });

    const venueIds = venues.map((v) => v.id);
    if (venueIds.length === 0) return [];

    const bookings = await db.query.bookingsTable.findMany({
      where: inArray(bookingsTable.venueId, venueIds),
      with: {
        venue: {
          columns: {
            id: true,
            name: true,
            city: true,
            images: true,
            bookingType: true,
          },
        },
        booker: {
          columns: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: (bookingsTable, { desc }) => [desc(bookingsTable.createdAt)],
    });

    return bookings;
  },
};
