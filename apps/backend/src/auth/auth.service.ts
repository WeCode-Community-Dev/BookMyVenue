import { AuthProvider, User } from '@prisma/client';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { GoogleUser } from 'src/types/google-auth.request.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/providers/mail/mail.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RedisService } from 'src/providers/redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import type { Response } from 'express';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
  ) {}

  private async generateAccessToken(user: User) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '15m',
      },
    );
  }

  private async generateRefreshToken(user: User) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        expiresIn: '7d',
      },
    );
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  async requestOtp(dto: RequestOtpDto) {
    console.log(dto);
    const { email } = dto;

    const redis = this.redisService.getClient();

    const rateLimitKey = `otp:ratelimit:${email}`;

    const rateLimit = await redis.get(rateLimitKey);

    if (rateLimit) {
      throw new HttpException(
        'Too many requests. Please wait before requesting another OTP.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `otp:${email}`;

    await redis.set(otpKey, otp, {
      EX: 300,
    });

    await redis.set(rateLimitKey, 'true', {
      EX: 60,
    });

    await this.mailService.sendMail({
      to: email,
      subject: 'Your OTP Code from book my venue',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    return {
      message: 'OTP sent successfully.',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { email, otp: enteredOtp } = dto;

    const redis = this.redisService.getClient();

    const otpKey = `otp:${email}`;

    const storedOtp = await redis.get(otpKey);

    console.log('stored otp ', storedOtp);
    console.log('entered otp', enteredOtp);

    if (!storedOtp || storedOtp !== enteredOtp) {
      throw new HttpException(
        'Invalid or expired OTP.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await redis.del(otpKey);

    let user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      const name = email.split('@')[0];

      user = await this.prismaService.user.create({
        data: {
          email,
          name,
          authProvider: AuthProvider.EMAIL,
        },
      });
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    const { password, refreshToken: _, ...safeUser } = user;

    return {
      message: 'User verified successfully.',
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  getMyProfile(user: User) {
    const { password, refreshToken, ...safeUser } = user;
    return { user: safeUser };
  }

  async googleLogin(googleUser: GoogleUser) {
    let user = await this.prismaService.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    // First time Google login
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email: googleUser.email,
          name: `${googleUser.firstName} ${googleUser.lastName}`,
          googleId: googleUser.googleId,
          avatarUrl: googleUser.picture,
          authProvider: AuthProvider.GOOGLE,
          isVerified: true,
        },
      });
    }

    // User already exists (possibly created using OTP)
    else if (!user.googleId) {
      user = await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          googleId: googleUser.googleId,
          avatarUrl: googleUser.picture,
          isVerified: true,
        },
      });
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    const { password, refreshToken: _, ...safeUser } = user;

    return {
      message: 'Google login successful.',
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  async upgradeToVenueOwner(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (user && user.role === 'USER') {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { role: 'VENUE_OWNER' },
      });
    }
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateAccessToken(user);
  }

  async register(dto: RegisterDto) {
    const { name, email, mobile, password } = dto;

    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { phone: mobile }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new HttpException(
          'Email already registered',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Phone number already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prismaService.user.create({
      data: {
        name,
        email,
        phone: mobile,
        password: hashedPassword,
        authProvider: AuthProvider.EMAIL,
        isVerified: true,
      },
    });

    return {
      success: true,
      message: 'User registered successfully.',
    };
  }
}
