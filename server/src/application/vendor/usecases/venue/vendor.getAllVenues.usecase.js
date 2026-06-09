import { AppError } from "../../../../domain/errors/app.error.js"
import { statusCode } from "../../../../shared/constants/enums/statusCode.js"
import { authMessages } from "../../../../shared/constants/messages/authMessages.js"

export class VendorGetAllVenuesUsecase {
    constructor (
        venueRepository,
        // ownerRepository
    ) {
        this._venueRepository = venueRepository
        // this._ownerRepository = ownerRepository
    }

    async execute(ownerId, page, limit, status, search) {
        // const owner = await this._ownerRepository.findById(ownerId)
        // if(!owner){
        //     throw new AppError(authMessages.error.OWNER_NOT_FOUND, statusCode.NOT_FOUND)
        // }
        const { data, totalPages, totalCount } = await this._venueRepository.findAllFiltered({ownerId, search, status, page, limit})

        return {
            data,
            totalPages,
            totalCount
        }

    }
}