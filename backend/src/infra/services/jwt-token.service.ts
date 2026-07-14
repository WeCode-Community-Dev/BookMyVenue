import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import type { ITokenService, TokenPayload } from '../../core/application/users/services/token.interface';

@Injectable()
export class JwtTokenService implements ITokenService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'bmv-secret-key-123456';
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'bmv-refresh-secret-key-123456';

  generateAccessToken(payload: TokenPayload): string {
    // @ts-ignore
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '1h',
    });
  }
  generateRefreshToken(payload: TokenPayload): string {
    // @ts-ignore
    return jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtRefreshSecret) as jwt.JwtPayload;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  }
}
