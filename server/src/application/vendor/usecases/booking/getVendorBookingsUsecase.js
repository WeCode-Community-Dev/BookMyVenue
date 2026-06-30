export class GetVendorBookingsUsecase {

    constructor( bookingRepository) {
        this._bookingRepository =
            bookingRepository
    }

    async execute({vendorId, page, limit, status, search}) {

        const bookings =
            await this._bookingRepository
                .findByOwnerId(vendorId, {page, limit, status, search})
        return bookings

    }

}