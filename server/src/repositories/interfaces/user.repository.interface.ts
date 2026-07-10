import { getAllUsersDto } from '@/dto/user/getAllUsers.dto';
import { IUser } from '../../models/user.model';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
  update(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteById(userId: string): Promise<void>;
  getAllUsers(query: getAllUsersDto): Promise<{ users: IUser[]; totalUsers: number }>;
}
