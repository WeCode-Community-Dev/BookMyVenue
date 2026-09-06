import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";
import { BookingStatus } from "../../../../domain/enums/Booking.enum.js";

export class UserPayRemainingBookingUsecase {
    constructor(bookingRepository) {
        this._bookingRepository = bookingRepository;
    }

    async execute(userId, bookingId, paymentMethod) {

        console.log("PAY REMAINING");
    console.log("userId:", userId);
    console.log("bookingId:", bookingId);
    console.log("paymentMethod:", paymentMethod);

const booking = await this._bookingRepository.getUserBookingById(
    userId,
    bookingId
);

if (!booking) {
    throw new NotFoundError(BookingMessages.error.BOOKING_NOT_FOUND);
}
        // Make sure the booking belongs to the logged-in user
if (booking.userId?.id !== userId) {
    throw new NotFoundError(
        BookingMessages.error.BOOKING_NOT_FOUND
    );
}
        if (booking.status === BookingStatus.CANCELLED) {
            throw new Error("Cancelled booking cannot receive payment");
        }

        if (booking.remainingAmount <= 0) {
            throw new Error("There is no remaining amount to pay");
        }

        if (!paymentMethod) {
            throw new Error("Payment method is required");
        }

        const remainingAmount = booking.remainingAmount;

        // Domain logic handles:
        // - payment deadline
        // - exact balance validation
        // - paidAmount
        // - remainingAmount
        // - paymentStatus
        booking.payBalance(remainingAmount);

        const updatedBooking =
            await this._bookingRepository.update(
                booking.id,
                booking
            );

        return updatedBooking;
    }
}