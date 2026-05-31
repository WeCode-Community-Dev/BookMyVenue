import { signupUser } from './auth.service.js';

export const signupController = async (
   req,
   res,
   next
) => {
   try {

      const user = await signupUser(req.body);

      res.status(201).json({
         success: true,
         message: 'Account created successfully',
         data: {
            id: user.id,
            name: user.name,
            email: user.email
         }
      });

   } catch (error) {
      next(error);
   }
};