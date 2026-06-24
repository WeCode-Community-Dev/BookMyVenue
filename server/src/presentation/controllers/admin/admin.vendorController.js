import { asyncHandler } from '../../../shared/utils/asyncHandler.js'
import { sendSuccess } from '../../../shared/utils/apiResponse.js'
import { statusCode } from '../../../shared/constants/enums/statusCode.js'
import { VendorMessages } from "../../../shared/constants/messages/vendorMessages.js";

export class AdminVendorController {
    constructor(
        AdminGetAllVendorsUsecase,
        AdminGetVendorByIdUsecase,
        AdminUpdateVendorApprovalStatusUsecase,
        AdminUpdateVendorStatusUsecase,
    ) {
        this._adminGetAllVendorsUsecase = AdminGetAllVendorsUsecase
        this._adminGetVendorByIdUsecase = AdminGetVendorByIdUsecase
        this._adminUpdateVendorApprovalStatusUsecase = AdminUpdateVendorApprovalStatusUsecase
        this._adminUpdateVendorStatusUsecase = AdminUpdateVendorStatusUsecase
    }

    getAllVendors = asyncHandler(async (req, res) => {
        const { page, limit, search, status } = req.validatedQuery

        const { data, totalCount, totalPages } =
            await this._adminGetAllVendorsUsecase.execute(
                search,
                status,
                page,
                limit
            )

        return sendSuccess(res, statusCode.OK, '', { data, totalCount, totalPages })
    })

    getVendorById = asyncHandler(async (req, res) => {
        const vendorId = req.params.vendorId

        const vendor =
            await this._adminGetVendorByIdUsecase.execute(vendorId)

        return sendSuccess(res, statusCode.OK, '', vendor)
    })

    updateApprovalStatus = asyncHandler(async (req, res) => {
        const vendorId = req.params.vendorId
        const { status, reason } = req.body

        const vendor =
            await this._adminUpdateVendorApprovalStatusUsecase.execute({
                vendorId,
                status,
                reason
            })

        return sendSuccess(res, statusCode.OK, '', vendor)
    })

    updateVendorStatus = asyncHandler(async (req, res) => {

        const { vendorId } = req.params;
        const { isBlocked } = req.body;

        const vendor =
            await this._adminUpdateVendorStatusUsecase.execute(vendorId, isBlocked)

        return sendSuccess(
            res,
            statusCode.OK,
            isBlocked ? VendorMessages.success.VENDOR_BLOCKED: VendorMessages.success.VENDOR_UNBLOCKED,
            vendor
        )
    })
}