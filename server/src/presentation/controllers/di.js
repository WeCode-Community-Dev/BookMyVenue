//usecase
import { VendorCreateVenueUsecase } from '../../application/vendor/usecases/venue/vendor.createVenue.usecase.js'
import {VendorVenueController} from '../controllers/vendor/vendor.venueController.js'
import { VenueRepository } from '../../infrastructure/repositories/venue.repository.js'
import { OwnerRepository }from '../../infrastructure/repositories/owner.repository.js'



//repository
const iVenueRepository = new VenueRepository()
const iOwnerRepository = new OwnerRepository()





//usecase
const iCreateVenueUsecase = new VendorCreateVenueUsecase(
    iVenueRepository,
    iOwnerRepository
)

//controller
export const iVendorVenueController = new VendorVenueController (
    iCreateVenueUsecase
)