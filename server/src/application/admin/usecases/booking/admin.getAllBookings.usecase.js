export class AdminGetAllBookingsUsecase {

    constructor(bookingRepository) {
        this._bookingRepository = bookingRepository;
    }

    async execute(
        search,
        status,
        paymentStatus,
        page,
        limit,
        sortBy,
        bookingDate
    ) {
        return await this._bookingRepository.findAllFiltered({
            search,
            status,
            paymentStatus,
            page,
            limit,
            sortBy,
            bookingDate
        });

    }

}