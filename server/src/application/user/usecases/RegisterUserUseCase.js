import bcrypt from "bcryptjs";
import { ConflictError } from "../../../domain/errors/ConflictError.js";
import UserMapper from "../../mapper/UserMapper.js";

class RegisterUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new ConflictError("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const user = await this.userRepository.create(userData);

        return UserMapper.toDTO(user);
    }
}

export default RegisterUserUseCase;
