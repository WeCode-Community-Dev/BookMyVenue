import type { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  save(user: User): Promise<void>;
  findAll(query?: { search?: string, offset: number, limit: number }): Promise<User[]>;
}
