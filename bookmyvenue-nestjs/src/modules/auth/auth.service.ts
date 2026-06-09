import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { MailService } from '../../shared/mail/mail.service';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../../shared/redis/redis.service';
import { randomInt } from 'crypto';
import { SignupCachePayload } from './types/signup-payload.type';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Injectable()
export class AuthService {
    private readonly signupTtlSeconds = 10 * 60;
    private readonly resendCooldownSeconds = 60;

    constructor(private readonly prisma: PrismaService,
        private readonly mailService: MailService,
        private readonly redisService: RedisService
    ) { }

    async register(registerDto: RegisterDto) {
        const email = this.normalizeEmail(registerDto.email);
        const name = registerDto.name.trim();
        const role = registerDto.role === Role.OWNER ? Role.OWNER : Role.USER;

        await this.ensureUserDoesNotExist(email);
        await this.ensureCooldownPassed(email);

        const otp = this.generateOtp();
        const passwordHash = await bcrypt.hash(registerDto.password, 10);
        const otpHash = await bcrypt.hash(otp, 10);

        const payload: SignupCachePayload = {
            email,
            name,
            passwordHash,
            role,
            otpHash,
        };

        await this.redisService.set(
            this.getSignupKey(email),
            JSON.stringify(payload),
            this.signupTtlSeconds,
        );

        await this.redisService.set(
            this.getCooldownKey(email),
            '1',
            this.resendCooldownSeconds,
        );

        try {
            await this.mailService.sendOtpEmail(email, name, otp);
        } catch {
            await this.redisService.del(this.getSignupKey(email));
            await this.redisService.del(this.getCooldownKey(email));

            throw new InternalServerErrorException(
                'Failed to send verification email. Try again.',
            );
        }

        return {
            message:
                'A verification OTP has been sent to your email. It will expire in 10 minutes.',
        };
    }

    async verifyOtp(verifySignupOtpDto: VerifySignupOtpDto) {
        const email = this.normalizeEmail(verifySignupOtpDto.email);
        const payload = await this.getSignupPayload(email);

        if (!payload) {
            throw new BadRequestException(
                'OTP expired or no active registration found. Please register again.',
            );
        }

        const isOtpValid = await bcrypt.compare(
            verifySignupOtpDto.otp,
            payload.otpHash,
        );

        if (!isOtpValid) {
            throw new BadRequestException('Invalid OTP');
        }

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: payload.email,
                    name: payload.name,
                    password: payload.passwordHash,
                    role: payload.role,
                },
            });

            await this.redisService.del(this.getSignupKey(email));
            await this.redisService.del(this.getCooldownKey(email));

            return {
                message: 'Account verified successfully! You can now log in.',
                userId: user.id,
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                await this.redisService.del(this.getSignupKey(email));
                await this.redisService.del(this.getCooldownKey(email));

                throw new ConflictException(
                    'Email is already registered. Please log in.',
                );
            }

            throw error;
        }
    }

    async resendOtp(resendOtpDto: ResendOtpDto) {
        const email = this.normalizeEmail(resendOtpDto.email);

        await this.ensureUserDoesNotExist(email);
        await this.ensureCooldownPassed(email);

        const existingPayload = await this.getSignupPayload(email);

        if (!existingPayload) {
            throw new BadRequestException(
                'OTP expired or no active registration found. Please register again.',
            );
        }

        const otp = this.generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        const updatedPayload: SignupCachePayload = {
            ...existingPayload,
            otpHash,
        };

        await this.redisService.set(
            this.getSignupKey(email),
            JSON.stringify(updatedPayload),
            this.signupTtlSeconds,
        );

        await this.redisService.set(
            this.getCooldownKey(email),
            '1',
            this.resendCooldownSeconds,
        );

        try {
            await this.mailService.sendOtpEmail(email, existingPayload.name, otp);
        } catch {
            throw new InternalServerErrorException('Failed to resend OTP. Try again.');
        }

        return {
            message: 'A new OTP has been sent to your email.',
        };
    }

    private normalizeEmail(email: string) {
        return email.trim().toLowerCase();
    }

    private getCooldownKey(email: string) {
        return `auth:signup:cooldown:${email}`;
    }

    private generateOtp() {
        return randomInt(100000, 1000000).toString();
    }

    private getSignupKey(email: string) {
        return `auth:signup:${email}`;
    }

    private async ensureUserDoesNotExist(email: string) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email is already registered. Please log in.');
        }
    }

    private async ensureCooldownPassed(email: string) {
        const ttl = await this.redisService.ttl(this.getCooldownKey(email));

        if (ttl > 0) {
            throw new BadRequestException(
                `Please wait ${ttl} seconds before requesting another OTP.`,
            );
        }
    }

    private async getSignupPayload(
        email: string,
    ): Promise<SignupCachePayload | null> {
        const raw = await this.redisService.get(this.getSignupKey(email));

        if (!raw) {
            return null;
        }

        return JSON.parse(raw) as SignupCachePayload;
    }
}
