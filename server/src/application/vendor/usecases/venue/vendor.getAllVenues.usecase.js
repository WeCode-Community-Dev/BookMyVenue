
export class VendorGetAllVenuesUsecase {
    constructor (
        venueRepository,
        // ownerRepository
    ) {
        this._venueRepository = venueRepository
        // this._ownerRepository = ownerRepository
    }

    async execute(vendorId, page, limit, category, status, search) {
        // const owner = await this._ownerRepository.findById(vendorId)
        // if(!owner){
        //     throw new AppError(authMessages.error.VENDOR_NOT_FOUND, statusCode.NOT_FOUND)
        // }
        const { data, totalPages, totalCount } = await this._venueRepository.findAllFiltered({vendorId, search, category, status, page, limit})

        return {
            data,
            totalPages,
            totalCount
        }

    }
}