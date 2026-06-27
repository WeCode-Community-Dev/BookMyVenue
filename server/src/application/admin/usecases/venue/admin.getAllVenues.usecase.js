export class AdminGetAllVenuesUsecase {

    constructor(venueRepository) {
        this._venueRepository = venueRepository;
    }

    async execute(
        search,
        category,
        approvalStatus,
        isBlocked,
        page,
        limit
    ) {

        return await this._venueRepository.findAllFiltered({
            search,
            category,
            approvalStatus,
            isBlocked,
            page,
            limit
        });

    }

}