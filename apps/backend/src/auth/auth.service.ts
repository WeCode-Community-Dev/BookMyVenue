import { AuthProvider, User } from '@prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GoogleUser } from 'src/types/google-auth.request.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/providers/mail/mail.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RedisService } from 'src/providers/redis/redis.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
  ) {}

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

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'User verified successfully.',
      token,
      user,
    };
  }

  getMyProfile(user: User) {
    return user;
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

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Google login successful.',
      token,
      user,
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
}
