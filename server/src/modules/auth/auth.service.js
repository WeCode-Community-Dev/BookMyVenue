import bcrypt from 'bcryptjs';
import prisma from '../../shared/config/db.js';
import { ERROR_MESSAGES } from '../../shared/constants/messages.js';
import { STATUS_CODES } from '../../shared/constants/statusCodes.js';
import ApiError from '../../shared/utils/apiError.js';

export const signupUser = async (userData) => {

   const existingUser = await prisma.user.findUnique({
      where: {
         email: userData.email
      }
   });

   if (existingUser)
        throw new ApiError(STATUS_CODES.BAD_REQUEST,ERROR_MESSAGES.USER_ALREADY_EXISTS);

   const hashedPassword = await bcrypt.hash(
      userData.password,
      10
   );

   const user = await prisma.user.create({
      data: {
         name: userData.name,
         email: userData.email,
         phone: userData.phone,
         passwordHash: hashedPassword,
         role: 'USER'
      }
   });

   return user;
};