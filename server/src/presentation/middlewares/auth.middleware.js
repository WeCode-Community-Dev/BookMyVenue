import { UnauthorizedError } from "../../domain/errors/UnauthorizedError.js";
import TokenService from "../../infrastructure/services/TokenService.js";

export const authenticate = (req, res, next) => {
    try {
        // Access token from Authorization header: "Bearer <token>"
        const token = req.headers?.authorization?.split(" ")[1];

        if (!token) {
            throw new UnauthorizedError("Access denied. No access token provided");
        }

        const decoded = TokenService.verifyAccessToken(token);
        req.user = decoded; // { userId, role }
        next();

    } catch (error) {
        next(error);
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return next(new UnauthorizedError("You do not have permission to access this resource"));
        }
        next();
    };
};
