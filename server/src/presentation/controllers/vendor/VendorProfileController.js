import { asyncHandler } from '../../../shared/utils/asyncHandler.js'
import { sendSuccess } from '../../../shared/utils/apiResponse.js'
import { statusCode } from '../../../shared/constants/enums/statusCode.js'
import { VendorMessages } from '../../../shared/constants/messages/vendorMessages.js'

export class VendorProfileController {

    constructor(
        GetVendorProfileUsecase,
        UpdateVendorProfileUsecase
    ) {

        this._getVendorProfileUsecase =
            GetVendorProfileUsecase

        this._updateVendorProfileUsecase =
            UpdateVendorProfileUsecase
    }

    getProfile = asyncHandler(async (req, res) => {

        const vendorId = '6a2d96f9bd24251e9e502c04'

        const vendor =
            await this._getVendorProfileUsecase.execute(
                vendorId
            )

        return sendSuccess(
            res,
            statusCode.OK,
            VendorMessages.success.PROFILE_FETCHED,
            vendor
        )

    })


    updateProfile = asyncHandler(async (req, res) => {

        const vendorId = '6a2d96f9bd24251e9e502c04'

        const vendor =
            await this._updateVendorProfileUsecase.execute({

                vendorId,

                ...req.body

            })

        return sendSuccess(
            res,
            statusCode.OK,
            VendorMessages.success.PROFILE_UPDATED,
            vendor
        )

    })

}