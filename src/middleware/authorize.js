import { ApiError } from '../utils/ApiError.js';

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required', 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden', 'FORBIDDEN'));
    }

    next();
  };
}
