import jwt from "jsonwebtoken";

import type { TokenService, TokenPayload } from "../../application/ports/TokenService.js";

export class JwtTokenService implements TokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || "default-secret-change-me";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch {
      return null;
    }
  }
}
