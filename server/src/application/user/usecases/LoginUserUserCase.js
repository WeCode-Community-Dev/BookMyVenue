import bcrypt from "bcryptjs";
import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import UserMapper from "../../mapper/UserMapper.js";

export default class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email, true);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedError("Invalid credentials");
        }

        return UserMapper.toDTO(user);
    }
}
