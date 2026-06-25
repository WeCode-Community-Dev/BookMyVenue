import { asyncHandler } from '../../../shared/utils/asyncHandler.js'
import { sendSuccess } from '../../../shared/utils/apiResponse.js'
import { statusCode } from '../../../shared/constants/enums/statusCode.js'
import { VendorMessages } from "../../../shared/constants/messages/vendorMessages.js";

export class AdminVendorController {
    constructor(
        AdminGetAllVendorsUsecase,
        AdminGetVendorByIdUsecase,
        AdminApproveVendorUsecase,
        AdminRejectVendorUsecase,
        AdminUpdateVendorStatusUsecase,
    ) {
        this._adminGetAllVendorsUsecase = AdminGetAllVendorsUsecase
        this._adminGetVendorByIdUsecase = AdminGetVendorByIdUsecase
        this._adminApproveVendorUsecase = AdminApproveVendorUsecase
        this._adminRejectVendorUsecase = AdminRejectVendorUsecase
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

     approveVendor = asyncHandler(async (req, res) => {
        const vendorId = req.params.vendorId
        const vendor =
            await this._adminApproveVendorUsecase.execute(vendorId);

        return sendSuccess(
            res,
            statusCode.OK,
            VendorMessages.success.VENDOR_APPROVED,
            vendor
        );
    });

    rejectVendor = asyncHandler(async (req, res) => {
        const vendorId = req.params.vendorId
        const reason = req.body.reason
        const vendor =
            await this._adminRejectVendorUsecase.execute(
                vendorId,
                reason
            );

        return sendSuccess(
            res,
            statusCode.OK,
            VendorMessages.success.VENDOR_REJECTED,
            vendor
        );
    });


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