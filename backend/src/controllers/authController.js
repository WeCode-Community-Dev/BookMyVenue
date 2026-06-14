import authService from '../services/authServices.js';
import { registerSchema } from '../validations/authValidations.js';
import { AppError } from '../handlers/error_handlers.js';
import { sendResponse } from '../handlers/response_handlers.js';

export default {
  login: async function (req, res) {
    const payload = req.body;
    const response = await authService.login(payload);
    console.log('Login response from service:', response);
    res.cookie('accessToken', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });
    sendResponse(res, response);
  },

  register: async function (req, res) {
    const payload = registerSchema.parse(req.body);
    const response = await authService.register(payload);
    sendResponse(res, response);
  },

  getCurrentUser: async function (req, res) {
    if (!req.user) {
      throw new AppError({
        message: 'User not found',
        statusCode: 404,
        errorCode: 'USER_NOT_FOUND',
      });
    }
    const response = { data: req.user };
    sendResponse(res, response);
  },
};
