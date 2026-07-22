import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not set in configuration');
    }
    // secret is guaranteed to be string here
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    } as any);
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        venues: {
          select: {
            id: true,
          },
          take: 1,
        },
      },
    });

    const effectiveRole =
      user?.role === Role.USER && (user.venues?.length || 0) > 0
        ? Role.VENUE_OWNER
        : user?.role || payload.role;

    return {
      userId: user?.id || payload.sub,
      email: user?.email || payload.email,
      role: effectiveRole,
    };
  }
}


