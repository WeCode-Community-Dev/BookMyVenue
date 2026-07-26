import bcrypt from 'bcrypt';
import { UserModel, type IUser } from '../../src/modules/user/user.models';

export interface CreateTestUserOptions {
  username?: string;
  email?: string;
  password?: string;
  active?: boolean;
  deleted?: boolean;
  isBanned?: boolean;
}

export const createTestUser = async (options: CreateTestUserOptions = {}): Promise<IUser> => {
  const username = options.username ?? `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const email = options.email ?? `${username}@example.com`;
  const plainPassword = options.password ?? 'Password@123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = new UserModel({
    username,
    email,
    password: hashedPassword,
    active: options.active ?? true,
    deleted: options.deleted ?? false,
    isBanned: options.isBanned ?? false,
  });

  return user.save();
};
