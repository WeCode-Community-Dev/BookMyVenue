import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyForgotPasswordOtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/pass-reset.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  //signup method to handle user registration
  async signUp(signUpDto: SignUpDto) {
    if (signUpDto.password !== signUpDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: signUpDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // OTP expiry (10 minutes)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        passwordHash: hashedPassword,

        isEmailVerified: false,
        emailVerifyOtp: hashedOtp,
        emailVerifyExpiry: otpExpiry,

        profile: {
          create: {
            name: signUpDto.email.split('@')[0],
          },
        },
      },
    });

    // Send OTP email
    await this.mailService.sendEmailVerificationOtp(user.email, otp);

    return {
      message:
        'Registration successful. Please verify your email using the OTP sent to your email address.',
      userId: user.id,
    };
  }

  //Google login method to handle user login  and signup via Google OAuth
  async googleLogin(googleUser: any) {
    let user = await this.prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    // First Google login
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          googleId: googleUser.googleId,
          isEmailVerified: true,
        },
      });

      await this.prisma.profile.create({
        data: {
          name: googleUser.name,
          profilePicture: googleUser.picture,
          userId: user.id,
        },
      });
    }

    // Email user later logs in with Google
    else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          googleId: googleUser.googleId,
        },
      });
    }

    const token = await this.getAccessToken(user.id, user.email, user.role);

    return {
      message: 'Google login successful',
      userId: user.id,
      token,
    };
  }

  //login method to handle user login
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user || !user.passwordHash) {
      throw new BadRequestException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const token = await this.getAccessToken(user.id, user.email, user.role);

    return { message: 'User logged in successfully', userId: user.id, token };
  }

  // Method to generate an access token for the user
  private async getAccessToken(userId: string, email: string, role: string) {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.signAsync(payload);
  }

  //forgot password method to handle forgot password functionality
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    //Genereate a otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store the OTP in the database with an expiration time (e.g., 10 minutes)
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const hashedOtp = await bcrypt.hash(otp, 10);
    await this.prisma.user.update({
      where: { email },
      data: {
        forgotPasswordOtp: hashedOtp,
        forgotPasswordOtpExpiry: expirationTime,
      },
    });

    await this.mailService.sendForgotPasswordOtp(user.email, otp);

    return { message: 'Password reset email sent' };
  }

  async verifyForgotPasswordOtp(verifyDto: VerifyForgotPasswordOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: verifyDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.forgotPasswordOtp || !user.forgotPasswordOtpExpiry) {
      throw new BadRequestException('OTP not found. Please request a new OTP.');
    }

    if (user.forgotPasswordOtpExpiry < new Date()) {
      throw new BadRequestException('OTP has expired.');
    }

    const isValid = await bcrypt.compare(verifyDto.otp, user.forgotPasswordOtp);

    if (!isValid) {
      throw new BadRequestException('Invalid OTP.');
    }

    return {
      message: 'OTP verified successfully.',
    };
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword, confirmPassword } = resetPasswordDto;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    // Find user
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordHash: hashedPassword,
        forgotPasswordOtp: null,
        forgotPasswordOtpExpiry: null,
        refreshTokenHash: null,
      },
    });

    return {
      message: 'Password reset successfully.',
    };
  }
}
