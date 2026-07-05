import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
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
  getMyProfile() {
    return {
      message: 'gddhydh',
    };
  }
}
