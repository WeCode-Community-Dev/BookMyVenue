import jwt from 'jsonwebtoken';
import { AppError } from '../handlers/error_handlers.js';
import userService from '../services/authServices.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new AppError({
        message: 'Unauthorized',
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userService.getById(decoded.userId);

    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: 401,
        errorCode: 'USER_NOT_FOUND',
      });
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError({
          message: `Forbidden: ${roles.join(' or ')} only`,
          statusCode: 403,
          errorCode: 'FORBIDDEN',
        })
      );
    }
    next();
  };
};
