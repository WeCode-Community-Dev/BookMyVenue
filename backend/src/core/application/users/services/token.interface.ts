import type { UserRole } from "src/core/domain/_shared/enum/UserRole";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload | null;
  verifyRefreshToken(token: string): TokenPayload | null;
}
