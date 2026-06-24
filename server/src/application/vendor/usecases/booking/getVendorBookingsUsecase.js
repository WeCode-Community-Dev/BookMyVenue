export class GetVendorBookingsUsecase {

    constructor( bookingRepository) {
        this._bookingRepository =
            bookingRepository
    }

    async execute({ownerId, page, limit, status}) {

        const bookings =
            await this._bookingRepository
                .findByOwnerId(ownerId, {page, limit, status})
        return bookings

    }

}