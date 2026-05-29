import type { User } from "../entities/User";
import type { UserRepository } from "../repositories/UserRepository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
