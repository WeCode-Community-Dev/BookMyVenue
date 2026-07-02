export class AdminGetBookingStatisticsUsecase {

    constructor(bookingRepository) {

        this._bookingRepository =
            bookingRepository;

    }

    async execute() {

        return await this
            ._bookingRepository
            .getBookingStatistics();

    }

}