import jwt, { type SignOptions } from "jsonwebtoken";

import type { UserRole } from "@prisma/client";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET env variable is required");
  }
  return secret;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded === "string" || !decoded.sub || !decoded.email || !decoded.role) {
    throw new jwt.JsonWebTokenError("Invalid token payload");
  }

  return {
    sub: decoded.sub,
    email: decoded.email as string,
    role: decoded.role as UserRole,
  };
}
