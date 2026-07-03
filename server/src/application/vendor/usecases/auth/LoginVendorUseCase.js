import TokenService from "../../../../infrastructure/services/TokenService.js";
import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";

export default class LoginVendorUseCase {
    constructor(vendorRepository, hashService) {
        this._vendorRepository = vendorRepository;
        this._hashService = hashService;
    }

    async execute(email, password) {
        const vendor = await this._vendorRepository.findByEmail(email, true);

        if (!vendor) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isMatch = await this._hashService.compare(password, vendor.password);
        if (!isMatch) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const payload = { userId: vendor.id, role: vendor.role };
        const accessToken = TokenService.generateAccessToken(payload);

        return { accessToken, vendor };
    }
}
