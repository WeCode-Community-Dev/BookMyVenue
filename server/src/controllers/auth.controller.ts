import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { BadRequestException } from "../utils/appError";
import { Env } from "../config/env.config";
import { RoleEnum } from "../enums/user-enum";
import { registerService, loginService } from "../services/auth.service";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestException("Name, email and password are required");
  }

  if (password.length < 6) {
    throw new BadRequestException("Password must be at least 6 characters long");
  }

  // Public signup may only create a CUSTOMER or an OWNER.
  // Anything else (e.g. ADMIN) is ignored and falls back to CUSTOMER.
  const allowedRole = role === RoleEnum.OWNER ? RoleEnum.OWNER : RoleEnum.CUSTOMER;

  const user = await registerService({ name, email, password, role: allowedRole });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "User registered successfully",
    user,
  });
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestException("Email and password are required");
  }

  const { user, accessToken } = await loginService({ email, password });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "Login successful",
    user,
  });
});
