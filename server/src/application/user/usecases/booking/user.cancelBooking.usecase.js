import { BookingStatus } from "../../../../domain/enums/Booking.enum.js";
import { PaymentStatus } from "../../../../domain/enums/Payment.enum.js";

import { BadRequestError } from "../../../../domain/errors/BadRequestError.js";
import { ForbiddenError } from "../../../../domain/errors/Forbidden.error.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";

import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";

export class UserCancelBookingUsecase {

    constructor(
        bookingRepository,
        mailService
    ) {

        this._bookingRepository = bookingRepository;
        this._mailService = mailService;

    }

    async execute(
        userId,
        bookingId,
        cancellationReason
    ) {

        const booking =
            await this._bookingRepository.findById(
                bookingId
            );

        if (!booking) {

            throw new NotFoundError(
                BookingMessages.error.BOOKING_NOT_FOUND
            );

        }

        if (booking.userId.id.toString() !== userId.toString()) {

            throw new ForbiddenError(
                BookingMessages.error.FORBIDDEN
            );

        }

        if (booking.status === BookingStatus.CANCELLED) {

            throw new BadRequestError(
                BookingMessages.error.BOOKING_ALREADY_CANCELLED
            );

        }

        if (booking.status === BookingStatus.COMPLETED) {

            throw new BadRequestError(
                BookingMessages.error.BOOKING_COMPLETED_CANNOT_CANCEL
            );

        }

        const today = new Date();

        const bookingDate = new Date(
            booking.bookingDate
        );

        const differenceInDays = Math.ceil(

            (bookingDate - today) /

            (1000 * 60 * 60 * 24)

        );

        let refundAmount = 0;

        if (differenceInDays >= 3) {

            if (

                booking.paymentStatus === PaymentStatus.PARTIAL

            ) {

                refundAmount = booking.advanceAmount;

            }

            else if (

                booking.paymentStatus === PaymentStatus.PAID

            ) {

                refundAmount =Math.round( booking.paidAmount * 0.90)

            }

        }

        booking.cancel(
            cancellationReason
        );

        await this._bookingRepository.cancelBooking(

            booking.id,

            booking.status,

            booking.cancellationReason

        );
                const emailData = {

            customerName: booking.userId.fullName,

            email: booking.userId.email,

            venueName: booking.venueId.name,

            bookingDate: booking.bookingDate,

            startTime: booking.startTime,

            endTime: booking.endTime,

            totalAmount: booking.totalAmount,

            paidAmount: booking.paidAmount,

            refundAmount,

            cancellationReason

        };

        await this._mailService.sendBookingCancellationMail(
            emailData
        );

        return {

            bookingId: booking.id,

            status: booking.status,

            refundAmount,

            message:
                BookingMessages.success.BOOKING_CANCELLED

        };

    }

}