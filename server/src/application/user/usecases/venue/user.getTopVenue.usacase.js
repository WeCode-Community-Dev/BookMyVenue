export class UserGetTopVenuesUsecase {
    constructor(
        venueRepository
    ){
        this._venueRepository = venueRepository
    }

    async execute(){
        const venues = await this._venueRepository.findTopVenues()
        return {
            venues
        }
    }
}