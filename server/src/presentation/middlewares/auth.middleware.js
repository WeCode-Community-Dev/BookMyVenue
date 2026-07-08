import { TokenExpiredError } from "jsonwebtoken";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../shared/constants/messages/authMessages.js";

export const authHandler = (tokenService) => {
    return async (req, res, next) => {
        
        const token = req.headers?.authorization?.split(" ")[1];

        if (!token) {
            throw new UnauthorizedError(authMessages.error.UNAUTHORIZED);
        }

        try {
            const isBlackListed = await tokenService.isTokenBlacklisted(token)
            if(isBlackListed){
                throw new UnauthorizedError(authMessages.error.UNAUTHORIZED)
            }
            const decoded = tokenService.verifyAccessToken(token);
            req.user = decoded; // { userId, role }
            console.log('decoded user: ', decoded)
            next();
        } catch (error) {
            if(error instanceof TokenExpiredError){
               throw new UnauthorizedError(authMessages.error.ACCESS_TOKEN_EXPIRED)
            }else{
               throw new UnauthorizedError(authMessages.error.UNAUTHORIZED)
            }
        }
    }
};

// export const authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user?.role)) {
//             return next(new UnauthorizedError("You do not have permission to access this resource"));
//         }
//         next();
//     };
// };
