import bcrypt from 'bcryptjs';

import prisma from '../../shared/config/db.js';

import { ERROR_MESSAGES } from '../../shared/constants/messages.js';
import { STATUS_CODES } from '../../shared/constants/statusCodes.js';

import ApiError from '../../shared/utils/apiError.js';

import { generateAccessToken } from '../../shared/utils/jwt.js';

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

         if (userData.accountType === 'OWNER') {

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

   const userWithRoles = await prisma.user.findUnique({

      where: {

         id: user.id

      },

      include: {

         roles: true

      }

   });
   const accessToken =
   generateAccessToken({

      userId: userWithRoles.id,

      roles: userWithRoles.roles.map(

         role => role.role

      )

   });
   // const accessToken = jwt.sign(

   //    {

   //       userId: userWithRoles.id,

   //       roles: userWithRoles.roles.map(

   //          role => role.role

   //       )

   //    },

   //    process.env.JWT_SECRET,

   //    {

   //       expiresIn: '7d'

   //    }

   // );

   return {

      accessToken,

      user: {

         id: userWithRoles.id,

         name: userWithRoles.name,

         email: userWithRoles.email,

         roles: userWithRoles.roles.map(

            role => role.role

         )

      }

   };

};

export const loginUser = async (
   credentials
) => {

   const user = await prisma.user.findUnique({

      where: {
         email: credentials.email
      },

      include: {
         roles: true
      }

   });

   if (!user) {

      throw new ApiError(
         STATUS_CODES.UNAUTHORIZED,
         ERROR_MESSAGES.INVALID_CREDENTIALS
      );

   }

   const isPasswordValid =
      await bcrypt.compare(
         credentials.password,
         user.passwordHash
      );

   if (!isPasswordValid) {

      throw new ApiError(
         STATUS_CODES.UNAUTHORIZED,
         ERROR_MESSAGES.INVALID_CREDENTIALS
      );

   }

   const roles = user.roles.map(
      role => role.role
   );

   const accessToken =
      generateAccessToken({

         userId: user.id,

         roles

      });

      return {
         accessToken,
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles
         }
      };

};