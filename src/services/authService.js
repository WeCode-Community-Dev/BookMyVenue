import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError.js';
import { signToken } from '../utils/token.js';
import { toPublicUser } from '../utils/userMapper.js';
import { userRepository } from '../repositories/userRepository.js';

const SALT_ROUNDS = 10;

export const authService = {
  async register({ username, email, mobileNumber, password, role }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(409, 'Email already registered', 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await userRepository.create({
      username,
      email,
      mobileNumber,
      passwordHash,
      role: role ?? 'CUSTOMER',
    });

    const token = signToken({ userId: user.id, role: user.role });

    return { user: toPublicUser(user), token };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const token = signToken({ userId: user.id, role: user.role });

    return { user: toPublicUser(user), token };
  },

  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return toPublicUser(user);
  },
};
