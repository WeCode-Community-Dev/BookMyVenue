import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../enums/user-role.enum';

interface JwtPayload {
  sub: string;
  role: UserRole;
  purpose: string;
}

/**
 * Passport JWT strategy — validates the Bearer token in every guarded request.
 * Extracts the JWT from Authorization: Bearer <token> header.
 * Returns { sub, role } which is attached to req.user by Passport.
 *
 * Rejects tokens whose `purpose` is not 'access' (e.g. phoneVerifiedToken).
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  validate(payload: JwtPayload): { sub: string; role: UserRole } {
    if (payload.purpose !== 'access') {
      throw new UnauthorizedException(
        'Invalid token type. Please use an access token.',
      );
    }

    return { sub: payload.sub, role: payload.role };
  }
}
