export class GetVendorBookingsUsecase {

    constructor(
        bookingRepository
    ) {
        this._bookingRepository =
            bookingRepository
    }

    async execute(ownerId) {

        const bookings =
            await this._bookingRepository
                .findByOwnerId(ownerId)
        return bookings

    }

}