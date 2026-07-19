import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";

export class UserChangePasswordUsecase {
  constructor(userRepository, hashService) {
    this._userRepository = userRepository;
    this._hashService = hashService;
  }

  async execute({ userId, currentPassword, newPassword }) {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(UserMessage.error.USER_NOT_FOUND);
    }

    const isPasswordCorrect = await this._hashService.compare(
      currentPassword,
      newPassword
    );
    if (!isPasswordCorrect) {
      throw new ValidationError(UserMessage.error.INVALID_CURRENT_PASSWORD);
    }

    const samePassword = await this._hashService.compare({
      currentPassword,
      newPassword,
    });
    if (samePassword) {
      throw new ValidationError(UserMessage.error.SAME_PASSWORD);
    }

    const hashedPassword = await this._hashService.hash(newPassword);
    await this.userRepository.upadatePassword(userId, hashedPassword);
    return null;
  }
}
