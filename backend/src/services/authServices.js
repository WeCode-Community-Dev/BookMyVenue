import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import { usersTable } from '../models/index.js';
import { AppError } from '../handlers/error_handlers.js';
import { hashPassword } from '../utils/utils.js';
import { eq } from 'drizzle-orm';

export default {
  getUserByEmail: async function (email) {
    const [existingUser] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
        salt: usersTable.salt,
        password: usersTable.password,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return existingUser;
  },

  register: async function (payload) {
    const { email, role, password, username } = payload;

    const currentUser = await this.getUserByEmail(email);
    if (currentUser) {
      throw new AppError({
        message: 'User already exists with this email',
        statusCode: 400,
        errorCode: 'USER_EXISTS',
      });
    }

    const { password: hashedPassword, salt } = await hashPassword(password);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        email,
        username,
        password: hashedPassword,
        salt,
        role,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
        role: usersTable.role,
      });
    return { data: newUser };
  },

  login: async function (payload) {
    const { email, password } = payload;
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new AppError({
        message: 'No user found with this email',
        statusCode: 404,
        errorCode: 'USER_NOT_FOUND',
      });
    }

    const { password: hashedPassword, salt } = await hashPassword(password, user.salt);

    if (hashedPassword !== user.password) {
      throw new AppError({
        message: 'Incorrect password',
        statusCode: 401,
        errorCode: 'INVALID_CREDENTIALS',
      });
    }

    const response = await jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Generated JWT:', response);

    return {
      token: response,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  },

  getById: async function (id) {
    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user;
  }
};

