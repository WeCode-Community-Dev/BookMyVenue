import { ConflictError } from "../../../domain/errors/ConflictError.js";
import VendorEntity from "../../../domain/entities/Vendor.js";

export default class RegisterVendorUseCase {
    constructor(vendorRepository, hashService) {
        this._vendorRepository = vendorRepository;
        this._hashService = hashService;
    }

    async execute(vendorData) {
        const existing = await this._vendorRepository.findByEmail(vendorData.email);

        if (existing) {
            throw new ConflictError("Email already exists");
        }

        const hashedPassword = await this._hashService.hash(vendorData.password);

        const vendorEntity = new VendorEntity({
            fullName: vendorData.fullName,
            email: vendorData.email,
            phone: vendorData.phone,
            password: hashedPassword,
            businessName: vendorData.businessName,
            role: "vendor"
        });

        const created = await this._vendorRepository.create(vendorEntity);
        return created;
    }
}
