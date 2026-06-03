import * as authService from "../services/authService.js";

import type { NextFunction, Request, Response } from "express";

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await authService.findUserById(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
