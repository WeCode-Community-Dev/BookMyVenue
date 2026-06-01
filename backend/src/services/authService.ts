import { prisma } from "../config/db.js";
import { AppError } from "../utils/AppError.js";
import { signAccessToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";

import type { LoginInput, RegisterInput } from "../validators/authSchemas.js";
import type { User, UserProfile } from "@prisma/client";

type UserWithProfile = User & { profile: UserProfile | null };

function toPublicUser(user: UserWithProfile) {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
    profile: user.profile
      ? {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          avatarUrl: user.profile.avatarUrl,
        }
      : null,
  };
}

async function findActiveUserByEmail(email: string): Promise<UserWithProfile | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user || user.deletedAt) {
    return null;
  }

  return user;
}

export async function register(input: RegisterInput) {
  const existingEmail = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingEmail) {
    throw new AppError(409, "CONFLICT", "Email already registered");
  }

  if (input.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: input.phone },
    });

    if (existingPhone) {
      throw new AppError(409, "CONFLICT", "Phone already registered");
    }
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.$transaction(async (tx) =>
    tx.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        passwordHash,
        role: input.role,
        profile: {
          create: {
            firstName: input.firstName,
            lastName: input.lastName,
          },
        },
      },
      include: { profile: true },
    })
  );

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: toPublicUser(user),
    accessToken,
  };
}

export async function login(input: LoginInput) {
  const user = await findActiveUserByEmail(input.email);

  if (!user?.passwordHash || !user.isActive) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  const passwordMatches = await comparePassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: toPublicUser(user),
    accessToken,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user || user.deletedAt || !user.isActive) {
    throw new AppError(404, "NOT_FOUND", "User not found");
  }

  return {
    user: toPublicUser(user),
  };
}
