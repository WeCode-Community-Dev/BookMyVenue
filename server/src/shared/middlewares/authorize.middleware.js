import ApiError from '../utils/apiError.js';
import { STATUS_CODES }
   from '../constants/statusCodes.js';

export const authorize = (
   ...allowedRoles
) => {

   return (
      req,
      res,
      next
   ) => {

      const roles =
         req.user.roles;

      const hasPermission =
         allowedRoles.some(
            role => roles.includes(role)
         );

      if (!hasPermission) {

         return next(

            new ApiError(

               STATUS_CODES.FORBIDDEN,

               'Access denied'

            )

         );

      }

      next();

   };

};