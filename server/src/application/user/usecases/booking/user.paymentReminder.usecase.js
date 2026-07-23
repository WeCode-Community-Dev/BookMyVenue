export class UserPaymentReminderUsecase {

    constructor(
        bookingRepository,
        userRepository,
        venueRepository,
        mailService
    ) {
        this._bookingRepository = bookingRepository;
        this._userRepository = userRepository;
        this._venueRepository = venueRepository;
        this._mailService = mailService;
    }

    async execute() {

    const tomorrow = new Date();

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );

    tomorrow.setHours(
        0,
        0,
        0,
        0
    );

    const bookings =
        await this._bookingRepository.getBookingsForPaymentReminder(
            tomorrow
        );

    for (const booking of bookings) {

        const user =
            await this._userRepository.findById(
                booking.userId
            );

        const venue =
            await this._venueRepository.findById(
                booking.venueId
            );

        if (!user || !venue) {
            continue;
        }

        const emailData = {

            customerName: user.fullName,

            email: user.email,

            venueName: venue.name,

            bookingDate: booking.bookingDate,

            startTime: booking.startTime,

            endTime: booking.endTime,

            totalAmount: booking.totalAmount,

            paidAmount: booking.paidAmount,

            remainingAmount: booking.remainingAmount

        };

        try {

            await this._mailService.sendPaymentReminderMail(
                emailData
            );

        } catch (error) {

            console.error("Failed to send payment reminder", error);

        }

    }

}

}