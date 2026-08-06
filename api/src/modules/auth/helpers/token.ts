import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../../../generated/prisma/enums.js';
import { UnauthorizedException } from '@nestjs/common';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export function createAccessToken(
  jwtService: JwtService,
  user: { id: string; email: string; role: UserRole },
): string {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return jwtService.sign(payload);
}

export function verifyAccessToken(
  jwtService: JwtService,
  token: string,
): AccessTokenPayload {
  try {
    return jwtService.verify(token);
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}

// export function decodeAccessToken(
//   jwtService: JwtService,
//   token: string,
// ): AccessTokenPayload {
//   return jwtService.decode(token);
// }