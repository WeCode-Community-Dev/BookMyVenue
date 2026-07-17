export class UserReserveBookingUsecase{
    constructor(bookingRepository,venueRepository){
        this._bookingRepository=bookingRepository;
        this._venueRepository=venueRepository
    }

    async execute(
    userId,
    {
        venueId,
        bookingDate,
        startTime,
        endTime,
        guestCount,
        bookingType
    }
) {

}
}