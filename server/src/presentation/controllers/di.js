//usecase
import { VendorEditVenueUsecase } from '../../application/vendor/usecases/venue/vendor.editVenue.usecase.js'
import { VendorCreateVenueUsecase } from '../../application/vendor/usecases/venue/vendor.createVenue.usecase.js'
import { VendorGetVenueByIdUsecase } from '../../application/vendor/usecases/venue/vendor.getVenueById.usecase.js'

import {VendorVenueController} from '../controllers/vendor/vendor.venueController.js'
import { VenueRepository } from '../../infrastructure/repositories/venue.repository.js'
import { VendorGetAllVenuesUsecase } from '../../application/vendor/usecases/venue/vendor.getAllVenues.usecase.js'
// import { OwnerRepository }from '../../infrastructure/repositories/owner.repository.js'



//repository
const iVenueRepository = new VenueRepository()
// const iOwnerRepository = new OwnerRepository()





//usecase
const iCreateVenueUsecase = new VendorCreateVenueUsecase(
    iVenueRepository,
)
const iUpdateVenueUsecase = new VendorEditVenueUsecase(
    iVenueRepository
)
const iVendorVenueGetById = new VendorGetVenueByIdUsecase (
    iVenueRepository
)
const iVendorGetAllVenues = new VendorGetAllVenuesUsecase (
    iVenueRepository
)
//controller
export const iVendorVenueController = new VendorVenueController (
    iCreateVenueUsecase,
    iUpdateVenueUsecase,
    iVendorVenueGetById,
    iVendorGetAllVenues,
)