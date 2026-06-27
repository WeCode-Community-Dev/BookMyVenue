import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { Env } from "../config/env.config";
import { UnauthorizedException } from "../utils/appError";
import { RoleEnum } from "../enums/user-enum";
import { registerService, loginService, getCurrentUserService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../validator/auth.validator";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = registerSchema.parse(req.body);

  // Schema guarantees role is OWNER, CUSTOMER, or undefined; default to CUSTOMER.
  const user = await registerService({
    name,
    email,
    password,
    role: role ?? RoleEnum.CUSTOMER,
  });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "User registered successfully",
    user,
  });
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

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

export const logoutController = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "Logout successful",
  });
});

export const getMeController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const user = await getCurrentUserService(userId);

  return res.status(HTTP_STATUS.OK).json({
    message: "User fetched successfully",
    user,
  });
});
