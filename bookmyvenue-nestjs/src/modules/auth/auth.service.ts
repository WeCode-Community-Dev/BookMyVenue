import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { MailService } from '../../shared/mail/mail.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly mailService: MailService
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, name, role = Role.USER } = registerDto;

        const existingUser = await this.prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new ConflictException('Email is already registered. Please log in.');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prisma.pendingRegistration.upsert({
            where: { email },
            update: {
                otp,
                name,
                password: hashedPassword,
                role,
                expiresAt,
            },
            create: {
                email,
                otp,
                name,
                password: hashedPassword,
                role,
                expiresAt,
            },
        });

        try {
            await this.mailService.sendOtpEmail(email, name, otp);
        } catch (error) {
            throw new InternalServerErrorException('Failed to send verification email. Try again.');
        }

        return {
            message: 'A verification OTP has been sent to your email. It will expire in 10 minutes',
        };
    }

    async verifyOtp(verifySignupOtpDto: VerifySignupOtpDto) {
        const { email, otp } = verifySignupOtpDto;

        const record = await this.prisma.pendingRegistration.findUnique({ where: { email } });

        if (!record) {
            throw new BadRequestException('No active registration found for this email.');
        }

        if (new Date() > record.expiresAt) {
            await this.prisma.pendingRegistration.delete({ where: { email } });
            throw new BadRequestException('OTP has expired. Please register again.');
        }

        if (record.otp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }

        const newUser = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: record.email,
                    name: record.name,
                    password: record.password,
                    role: record.role,
                },
            });

            await tx.pendingRegistration.delete({ where: { email } });

            return user;
        });

        return {
            message: 'Account verified successfully! You can now log in.',
            userId: newUser.id,
        };
    }
}
