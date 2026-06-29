import { AppError } from "../../../../domain/errors/app.error.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { statusCode } from "../../../../shared/constants/enums/statusCode.js";
import { VendorMessages } from "../../../../shared/constants/messages/vendorMessages.js";
import { VendorEntity } from "../../../../domain/entities/Vendor.js";
import { BadRequestError } from "../../../../domain/errors/BadRequestError.js";

export class AdminUpdateVendorStatusUsecase {
    constructor(vendorRepository){
        this._vendorRepository = vendorRepository;
    }

    async execute(vendorId, isBlocked){
        const vendor = await this._vendorRepository.findById(vendorId);
        if(!vendor){
            throw new NotFoundError(VendorMessages.error.VENDOR_NOT_FOUND)
            
        }
        if(vendor.approvalStatus!=="APPROVED"){
            throw new BadRequestError(VendorMessages.error.VENDOR_NOT_APPROVED_FOR_BLOCK_ACTION)
        }
        const updatedVendor = await this._vendorRepository.updateBlockStatus(vendorId, isBlocked);
        return updatedVendor;
    }
}