import jwt, { SignOptions } from "jsonwebtoken";
import { Env } from "../config/env.config";

export interface AccessTokenPayload {
  userId: string;
  role: string;
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, Env.JWT_ACCESS_SECRET, {
    expiresIn: Env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, Env.JWT_ACCESS_SECRET) as AccessTokenPayload;
};
