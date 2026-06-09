import ApiError from '../utils/apiError.js';
import { verifyAccessToken }
   from '../utils/jwt.js';

import { STATUS_CODES }
   from '../constants/statusCodes.js';

export const authenticate = (
   req,
   res,
   next
) => {

   try {

      const authHeader =
         req.headers.authorization;

      if (
         !authHeader ||
         !authHeader.startsWith('Bearer ')
      ) {

         throw new ApiError(

            STATUS_CODES.UNAUTHORIZED,

            'Authentication required'

         );

      }

      const token =
         authHeader.split(' ')[1];

      const decoded =
         verifyAccessToken(token);

      req.user = decoded;

      next();

   } catch (error) {

      next(error);

   }

};