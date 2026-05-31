import bcrypt from 'bcryptjs';
import prisma from '../../shared/config/db.js';

export const signupUser = async (userData) => {

   const existingUser = await prisma.user.findUnique({
      where: {
         email: userData.email
      }
   });

   if (existingUser) {
      throw new Error('Email already registered');
   }

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