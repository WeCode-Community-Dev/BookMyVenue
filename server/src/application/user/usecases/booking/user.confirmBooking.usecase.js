import { Booking } from "../../../../domain/entities/Booking.js";

import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";

import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";

export class UserConfirmBookingUsecase {
    constructor(
        bookingRepository,
       reservationService,
        userRepository,
        venueRepository,
        mailService
    ) {
        this._bookingRepository = bookingRepository;
        this._reservationService =reservationService;
        this._userRepository = userRepository;
        this._venueRepository = venueRepository;
        this._mailService = mailService;
    }

    async execute({
        reservationId,
        venueId,
        bookingDate
    }) {
const reservationKey = `reservation:${venueId}:${bookingDate}`;
console.log("Looking up reservation with key:", reservationKey);
        const reservations =
            await this._reservationService.getReservation(reservationKey);

        if (!reservations || reservations.length === 0) {
            throw new NotFoundError(
                BookingMessages.error.RESERVATION_NOT_FOUND
            );
        }

        const reservation = reservations.find(
            (item) => item.reservationId === reservationId
        );

        if (!reservation) {
            throw new NotFoundError(
                BookingMessages.error.RESERVATION_NOT_FOUND
            );
        }
          const user =
            await this._userRepository.findById(
                reservation.userId
            );
              if (!user) {
                throw new NotFoundError(BookingMessages.error.USER_NOT_FOUND);
            }
        const venue =
            await this._venueRepository.findById(
                reservation.venueId
            );


            if (!venue) {
                throw new NotFoundError(BookingMessages.error.VENUE_NOT_FOUND);
            }

        const booking = new Booking({
            userId: reservation.userId,
            venueId: reservation.venueId,
            vendorId: reservation.vendorId,
            bookingDate: reservation.bookingDate,
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            guestCount: reservation.guestCount,
            totalAmount: reservation.totalAmount,
            advanceAmount: reservation.advanceAmount,
            remainingAmount: reservation.remainingAmount
        });

        booking.payAmount(reservation.advanceAmount);

        booking.confirm();

        const savedBooking =
            await this._bookingRepository.create(booking);
      

        const emailData = {

            customerName: user.fullName,

            email: user.email,

            venueName: venue.name,

            bookingDate: reservation.bookingDate,

            startTime: reservation.startTime,

            endTime: reservation.endTime,

            guestCount: reservation.guestCount,

            bookingType: reservation.bookingType,

            totalAmount: reservation.totalAmount,

            paidAmount: reservation.advanceAmount,

            remainingAmount: reservation.remainingAmount

        };

        const updatedReservations = reservations.filter(
            (item) => item.reservationId !== reservationId
        );

        if (updatedReservations.length > 0) {

            await this._reservationService.reserveSlot(
                reservationKey,
                updatedReservations,
                600
            );

        } else {

            await this._reservationService.deleteReservation(
                reservationKey
            );

        }

        await this._mailService.sendBookingConfirmationMail(
            emailData
        );

        return savedBooking;
    }
}