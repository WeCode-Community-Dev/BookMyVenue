import bcrypt from 'bcryptjs';

import prisma from '../../shared/config/db.js';

import { ERROR_MESSAGES } from '../../shared/constants/messages.js';
import { STATUS_CODES } from '../../shared/constants/statusCodes.js';

import ApiError from '../../shared/utils/apiError.js';

export const signupUser = async (userData) => {

   const existingUser = await prisma.user.findFirst({
      where: {
         OR: [
            {
               email: userData.email
            },
            {
               phone: userData.phone
            }
         ]
      }
   });

   if (existingUser) {
      throw new ApiError(
         STATUS_CODES.BAD_REQUEST,
         ERROR_MESSAGES.USER_ALREADY_EXISTS
      );

   }

   const hashedPassword = await bcrypt.hash(
      userData.password,
      10
   );

   const user = await prisma.$transaction(
      async (tx) => {
         const createdUser = await tx.user.create({
            data: {
               name: userData.name,
               email: userData.email,
               phone: userData.phone,
               passwordHash: hashedPassword
            }
         });

         await tx.userRole.create({
            data: {
               userId: createdUser.id,
               role: 'USER'
            }
         });

         if (
            userData.accountType === 'OWNER'
         ) {
            await tx.userRole.create({
               data: {
                  userId: createdUser.id,
                  role: 'OWNER'
               }
            });

            await tx.venue.create({
               data: {
                  ownerId: createdUser.id,
                  name: userData.venue.name,
                  type: userData.venue.type,
                  city: userData.venue.city
               }
            });
         }
         return createdUser;
      }
   );

   return {
      id: user.id,
      name: user.name,
      email: user.email
   };
};