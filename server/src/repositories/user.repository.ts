import User from '../models/user.model';
import { IUser } from '../models/interfaces/user-scheme.interface';
import { IUserRepository } from './interfaces/user.repository.interface';
import { getAllUsersDto } from '../dto/user/getAllUsers.dto';

export const userRepository: IUserRepository = {
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  },

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  },

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  },

  async update(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  },

  async deleteById(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  },

  async getAllUsers(query: getAllUsersDto): Promise<{ users: IUser[]; totalUsers: number }> {
    const { status, role, search, sort, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      if (status === 'active') {
        filter.isBlocked = false;
      } else if (status === 'blocked') {
        filter.isBlocked = true;
      }
    }

    if (role && role !== 'all') {
      filter.role = role;
    }

    const sortOption: any = {};
    if (sort === 'a-z') {
      sortOption.fullName = 1;
    } else if (sort === 'z-a') {
      sortOption.fullName = -1;
    } else if (sort === 'asc') {
      sortOption.createdAt = 1;
    } else {
      sortOption.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find(filter).sort(sortOption).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return { users, totalUsers };
  },
};
