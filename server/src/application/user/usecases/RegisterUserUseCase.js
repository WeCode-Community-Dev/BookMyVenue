import { ConflictError } from "../../../domain/errors/ConflictError.js";
import { UserRole } from "../../../domain/enums/UserRole.enum.js";
import { UserEntity } from "../../../domain/entities/User.js";

class RegisterUserUseCase {
    constructor(userRepository, hashService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
    }

    async execute(userData) {
        const existing = await this._userRepository.findByEmail(userData.email);

        if (existing) {
            throw new ConflictError("Email already exists");
        }

        const hashedPassword = await this._hashService.hash(userData.password);

        const userEntity = new UserEntity({
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: hashedPassword,
            role: UserRole.CUSTOMER
        });

        const created = await this._userRepository.create(userEntity);

        return created;
    }
}

export default RegisterUserUseCase;
