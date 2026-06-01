import * as authService from "../services/authService.js";

import type { LoginInput, RegisterInput } from "../validators/authSchemas.js";
import type { NextFunction, Request, Response } from "express";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await authService.register(req.body as RegisterInput);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await authService.login(req.body as LoginInput);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const data = await authService.getMe(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
