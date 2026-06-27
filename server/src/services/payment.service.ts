import { randomUUID } from "crypto";
import mongoose from "mongoose";
import PaymentModel from "../models/payment.model";
import ReservationModel from "../models/reservation.model";
import { getVenueByIdService } from "./venue.service";
import { createBookingService } from "./booking.service";
import { ForbiddenException, HttpException, NotFoundException } from "../utils/appError";
import { HTTP_STATUS } from "../config/http.config";
import { ProviderEnum, PaymentStatusEnum } from "../enums/payment.enum";
import { ReservationStatusEnum } from "../enums/reservation-enum";

type CreateOrderParams = {
  reservationId: string;
  customer: string;
};

type VerifyPaymentParams = {
  orderId: string;
  success: boolean;
  customer: string;
};

const getHours = (start: Date, end: Date): number =>
  (end.getTime() - start.getTime()) / (1000 * 60 * 60);

const isHoldActive = (reservation: { status: string; expiresAt: Date }): boolean =>
  reservation.status === ReservationStatusEnum.PENDING &&
  reservation.expiresAt.getTime() > Date.now();

export const createOrderService = async ({ reservationId, customer }: CreateOrderParams) => {
  const reservation = await ReservationModel.findById(reservationId);
  if (!reservation || !isHoldActive(reservation)) {
    throw new HttpException(
      "Reservation not found or expired. Please reserve again.",
      HTTP_STATUS.CONFLICT,
    );
  }

  if (reservation.customer.toString() !== customer) {
    throw new ForbiddenException("This reservation does not belong to you");
  }

  const venue = await getVenueByIdService(reservation.venue.toString());
  const amount = venue.pricePerHour * getHours(reservation.startTime, reservation.endTime);

  const orderId = `order_${randomUUID()}`;

  const payment = await PaymentModel.create({
    customer,
    reservation: reservation._id,
    amount,
    provider: ProviderEnum.DUMMY,
    transactionId: orderId,
    paymentStatus: PaymentStatusEnum.PENDING,
  });

  return { orderId, amount, paymentId: payment._id };
};

export const verifyPaymentService = async ({ orderId, success, customer }: VerifyPaymentParams) => {
  const payment = await PaymentModel.findOne({ transactionId: orderId, customer });
  if (!payment) {
    throw new NotFoundException("Payment order not found");
  }

  if (payment.paymentStatus !== PaymentStatusEnum.PENDING) {
    throw new HttpException("This payment has already been processed", HTTP_STATUS.CONFLICT);
  }

  const reservation = await ReservationModel.findById(payment.reservation);

  if (!success) {
    payment.paymentStatus = PaymentStatusEnum.FAILED;
    await payment.save();
    if (reservation) {
      await reservation.deleteOne();
    }
    throw new HttpException("Payment failed. Reservation released.", HTTP_STATUS.BAD_REQUEST);
  }

  if (!reservation || !isHoldActive(reservation)) {
    payment.paymentStatus = PaymentStatusEnum.FAILED;
    await payment.save();
    throw new HttpException(
      "Reservation expired before payment completed. Please reserve again.",
      HTTP_STATUS.CONFLICT,
    );
  }

  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const booking = await createBookingService(
        {
          venue: reservation.venue,
          customer: reservation.customer,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          totalAmount: payment.amount,
        },
        session,
      );

      payment.booking = booking._id as typeof payment.booking;
      payment.paymentStatus = PaymentStatusEnum.SUCCESS;
      await payment.save({ session });

      await reservation.deleteOne({ session });

      return { booking, payment };
    });
  } finally {
    session.endSession();
  }
};
