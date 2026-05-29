import { Router } from "express";
import { z } from "zod";

import { LoginUser } from "../../../application/use-cases/auth/LoginUser.js";
import { RegisterUser } from "../../../application/use-cases/auth/RegisterUser.js";
import { validateRequest } from "../middleware/validateRequest.js";

import type { HashingService } from "../../../application/ports/HashingService.js";
import type { TokenService } from "../../../application/ports/TokenService.js";
import type { UserRepository } from "../../../domain/repositories/UserRepository.js";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

interface AuthRouterDependencies {
  userRepository: UserRepository;
  hashingService: HashingService;
  tokenService: TokenService;
}

export function createAuthRouter({
  userRepository,
  hashingService,
  tokenService,
}: AuthRouterDependencies): Router {
  const router = Router();

  router.post("/register", validateRequest(registerSchema), async (req, res, next) => {
    try {
      const registerUser = new RegisterUser(userRepository, hashingService, tokenService);
      const result = await registerUser.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  router.post("/login", validateRequest(loginSchema), async (req, res, next) => {
    try {
      const loginUser = new LoginUser(userRepository, hashingService, tokenService);
      const result = await loginUser.execute(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
