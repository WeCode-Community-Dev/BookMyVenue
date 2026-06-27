import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { MailService } from '../../shared/mail/mail.service';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../../shared/redis/redis.service';
import { SignupCachePayload } from './types/signup-payload.type';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { normalizeEmail } from './utils/normalize-email';
import { generateOtp } from './utils/generate-otp';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordPayload } from './types/forgot-password-payload.type';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtTokenService } from '../../shared/jwt/jwt.service';
import { VerifyForgotPasswordOtpDto } from './dto/verify-forgot-password.dto';

@Injectable()
export class AuthService {
    private readonly signupTtlSeconds: number;
    private readonly resendCooldownSeconds: number;
    private readonly forgotPasswordTtlSeconds: number;
    private readonly forgotPasswordCooldownSeconds: number;

    constructor(private readonly prisma: PrismaService,
        private readonly mailService: MailService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtTokenService
    ) {
        this.signupTtlSeconds = Number(
            this.configService.get('SIGNUP_OTP_TTL_SECONDS', 600),
        );

        this.resendCooldownSeconds = Number(
            this.configService.get('SIGNUP_RESEND_COOLDOWN_SECONDS', 60),
        );
        this.forgotPasswordTtlSeconds = Number(
            this.configService.get('FORGOT_PASSWORD_OTP_TTL_SECONDS', 600),
        );

        this.forgotPasswordCooldownSeconds = Number(
            this.configService.get('FORGOT_PASSWORD_COOLDOWN_SECONDS', 60),
        );
    }

    async register(registerDto: RegisterDto) {
        const email = normalizeEmail(registerDto.email);
        const name = registerDto.name.trim();
        const role = registerDto.role === Role.OWNER ? Role.OWNER : Role.USER;

        await this.ensureUserDoesNotExist(email);
        await this.ensureCooldownPassed(email);

        const otp = generateOtp();
        const passwordHash = await bcrypt.hash(registerDto.password, 10);
        const otpHash = await bcrypt.hash(otp, 10);

        const payload: SignupCachePayload = {
            email,
            name,
            passwordHash,
            role,
            otpHash,
        };

        await this.redisService.set(this.getSignupKey(email), JSON.stringify(payload), this.signupTtlSeconds);

        await this.redisService.set(this.getCooldownKey(email), '1', this.resendCooldownSeconds);

        try {
            await this.mailService.sendOtpEmail(email, name, otp);
        } catch {
            await this.redisService.del(this.getSignupKey(email));
            await this.redisService.del(this.getCooldownKey(email));

            throw new InternalServerErrorException('Failed to send verification email. Try again.');
        }

        return {
            success: true,
            message: 'A verification OTP has been sent to your email. It will expire in 10 minutes.',
        };
    }

    async verifyOtp(verifySignupOtpDto: VerifySignupOtpDto) {
        const email = normalizeEmail(verifySignupOtpDto.email);
        const payload = await this.getSignupPayload(email);

        if (!payload) {
            throw new BadRequestException('OTP expired or no active registration found. Please register again.');
        }

        const isOtpValid = await bcrypt.compare(verifySignupOtpDto.otp, payload.otpHash);

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
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                await this.redisService.del(this.getSignupKey(email));
                await this.redisService.del(this.getCooldownKey(email));

                throw new ConflictException('Email is already registered. Please log in.');
            }
            throw error;
        }
    }

    async resendOtp(resendOtpDto: ResendOtpDto) {
        const email = normalizeEmail(resendOtpDto.email);

        await this.ensureUserDoesNotExist(email);
        await this.ensureCooldownPassed(email);

        const existingPayload = await this.getSignupPayload(email);
        const oldPayload = existingPayload

        if (!existingPayload) {
            throw new BadRequestException('OTP expired or no active registration found. Please register again.');
        }

        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        const updatedPayload: SignupCachePayload = {
            ...existingPayload,
            otpHash,
        };

        await this.redisService.set(this.getSignupKey(email), JSON.stringify(updatedPayload), this.signupTtlSeconds);

        await this.redisService.set(this.getCooldownKey(email), '1', this.resendCooldownSeconds);

        try {
            await this.mailService.sendOtpEmail(email, existingPayload.name, otp);
        } catch {
            await this.redisService.set(this.getSignupKey(email), JSON.stringify(oldPayload), this.signupTtlSeconds);
            await this.redisService.del(this.getCooldownKey(email));

            throw new InternalServerErrorException('Failed to resend OTP. Try again.');
        }

        return {
            success: true,
            message: 'A new OTP has been sent to your email.',
        };
    }

    async login(loginDto: LoginDto) {
        const email = normalizeEmail(loginDto.email);

        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password,);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        const accessToken = await this.jwtService.generateAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            success: 'true',
            message: 'Login successful.',
            'data': {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            }
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const email = normalizeEmail(forgotPasswordDto.email);

        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            return {
                message: 'If an account with this email exists, a password reset OTP has been sent.',
            };
        }

        await this.ensureCooldownPassed(this.getForgotPasswordCooldownKey(email), false);

        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        const payload: ForgotPasswordPayload = {
            email,
            otpHash,
        };

        await this.redisService.set(this.getForgotPasswordKey(email), JSON.stringify(payload), this.forgotPasswordTtlSeconds);

        await this.redisService.set(this.getForgotPasswordCooldownKey(email), '1', this.forgotPasswordCooldownSeconds);

        try {
            await this.mailService.sendForgotPasswordOtpEmail(user.email, user.name, otp);
        } catch {
            await this.redisService.del(this.getForgotPasswordKey(email));
            await this.redisService.del(this.getForgotPasswordCooldownKey(email));

            throw new InternalServerErrorException('Failed to send password reset OTP. Try again.');
        }

        return {
            success: true,
            message: 'If an account with this email exists, a password reset OTP has been sent.',
        };
    }

    async verifyForgotPasswordOtp(verifyForgotPasswordOtpDto: VerifyForgotPasswordOtpDto) {
        const email = normalizeEmail(verifyForgotPasswordOtpDto.email);
        const payload = await this.getForgotPasswordPayload(email);

        if (!payload) {
            throw new BadRequestException('OTP expired or no password reset request found.');
        }

        const isOtpValid = await bcrypt.compare(verifyForgotPasswordOtpDto.otp, payload.otpHash);

        if (!isOtpValid) {
            throw new BadRequestException('Invalid OTP');
        }

        await this.redisService.set(this.getForgotPasswordVerifiedKey(email), '1', this.forgotPasswordTtlSeconds);

        await this.redisService.del(this.getForgotPasswordKey(email));

        return {
            success: true,
            message: 'OTP verified successfully. You can now reset your password.',
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const email = normalizeEmail(resetPasswordDto.email);

        if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
            throw new BadRequestException('Passwords do not match.');
        }

        const isVerified = await this.redisService.get(this.getForgotPasswordVerifiedKey(email),);

        if (!isVerified) {
            throw new BadRequestException('Password reset not verified. Please verify OTP first.',);
        }

        const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, 10);

        await this.prisma.user.update({
            where: { email },
            data: { password: passwordHash },
        });

        await this.redisService.del(this.getForgotPasswordVerifiedKey(email));
        await this.redisService.del(this.getForgotPasswordCooldownKey(email));

        return {
            success: true,
            message: 'Password reset successful. You can now log in.',
        };
    }

    async me(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
        };
    }

    async logout() {
        return {
            success: true,
            message: 'Logged out successfully.',
        };
    }

    private getCooldownKey(email: string) {
        return `auth:signup:cooldown:${email}`;
    }

    private getSignupKey(email: string) {
        return `auth:signup:${email}`;
    }

    private getForgotPasswordKey(email: string) {
        return `auth:forgot-password:${email}`;
    }

    private getForgotPasswordCooldownKey(email: string) {
        return `auth:forgot-password:cooldown:${email}`;
    }

    private getForgotPasswordVerifiedKey(email: string) {
        return `auth:forgot-password:verified:${email}`;
    }

    private async ensureUserDoesNotExist(email: string) {
        const existingUser = await this.prisma.user.findUnique({ where: { email }, });

        if (existingUser) {
            throw new ConflictException('Email is already registered. Please log in.');
        }
    }

    private async ensureCooldownPassed(email: string, useSignupKey = true) {
        const cooldownKey = useSignupKey ? this.getCooldownKey(email) : email;
        const ttl = await this.redisService.ttl(cooldownKey);

        if (ttl > 0) {
            throw new BadRequestException(`Please wait ${ttl} seconds before requesting another OTP.`,);
        }
    }

    private async getSignupPayload(email: string,): Promise<SignupCachePayload | null> {
        const raw = await this.redisService.get(this.getSignupKey(email));

        if (!raw) {
            return null;
        }

        return JSON.parse(raw) as SignupCachePayload;
    }

    private async getForgotPasswordPayload(email: string,): Promise<ForgotPasswordPayload | null> {
        const raw = await this.redisService.get(this.getForgotPasswordKey(email));

        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw) as ForgotPasswordPayload;
        } catch {
            await this.redisService.del(this.getForgotPasswordKey(email));
            return null;
        }
    }
}