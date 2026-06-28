export class GetVendorBookingsUsecase {

    constructor( bookingRepository) {
        this._bookingRepository =
            bookingRepository
    }

    async execute({ownerId, page, limit, status, search}) {

        const bookings =
            await this._bookingRepository
                .findByOwnerId(ownerId, {page, limit, status, search})
        return bookings

    }

}