import { authService } from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.user.id);
    res.json({ success: true, data: { user } });
  }),
};
