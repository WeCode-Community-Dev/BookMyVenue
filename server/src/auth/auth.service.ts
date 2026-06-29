import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(registerDto: RegisterDto) {
    const { name, email, phone, password, role } = registerDto;

    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create OTP
    const isOwnerOrUser = !role || role === UserRole.USER || role === UserRole.VENUE_OWNER;
    const otp = isOwnerOrUser ? this.generateOtp() : null;
    const otpExpires = isOwnerOrUser ? new Date(Date.now() + 5 * 60 * 1000) : null; // 5 minutes

    // Create user
    const user = this.usersRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || UserRole.USER,
      otp: otp as any,
      otpExpires: otpExpires as any,
      isOtpVerified: !isOwnerOrUser, // Admin verified automatically
    });

    await this.usersRepository.save(user);

    // Emit event asynchronously for welcome email with OTP
    this.eventEmitter.emit('user.registered', { user, otp });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      message: 'Registration successful',
      user: this.sanitizeUser(user),
      token: tokens.accessToken,
      ...tokens,
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        profileImage: true,
        otp: true,
        otpExpires: true,
        isOtpVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isOtpVerified) {
      return {
        message: 'OTP already verified',
        user: this.sanitizeUser(user),
      };
    }

    if (!user.otp || !user.otpExpires) {
      throw new BadRequestException('No active OTP found. Please request a new one.');
    }

    if (new Date() > user.otpExpires) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    user.isOtpVerified = true;
    user.otp = null as any;
    user.otpExpires = null as any;

    await this.usersRepository.save(user);

    return {
      message: 'OTP verified successfully',
      user: this.sanitizeUser(user),
    };
  }

  async resendOtp(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isOtpVerified) {
      throw new BadRequestException('Account is already verified');
    }

    const otp = this.generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;

    await this.usersRepository.save(user);

    // Emit event for resend email
    this.eventEmitter.emit('user.otpResent', { user, otp });

    return {
      message: 'OTP resent successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user with password
    const user = await this.usersRepository.findOne({
      where: { email },
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, password: true, profileImage: true, isOtpVerified: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Your account has been blocked');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      token: tokens.accessToken,
      ...tokens,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal whether user exists
      return { message: 'If an account exists with this email, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await this.usersRepository.save(user);

    // In production, send email with reset link
    // For now, return the token (dev only)
    return {
      message: 'If an account exists with this email, a reset link has been sent',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await this.usersRepository.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null as any;
    user.resetPasswordExpires = null as any;

    await this.usersRepository.save(user);

    return { message: 'Password reset successful' };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET') || this.configService.get<string>('JWT_SECRET') || 'bmv-default-secret';
    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'bmv-refresh-default-secret';
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as any,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.usersRepository.update(user.id, {
      currentHashedRefreshToken: hashedRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'bmv-refresh-default-secret';
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });
      return this.refreshTokens(payload.sub, refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        name: true,
        profileImage: true,
        currentHashedRefreshToken: true,
        isOtpVerified: true,
      },
    });

    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Your account has been blocked');
    }

    // Compare hashed refresh tokens
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Access denied');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: null as any,
    });
  }

  private sanitizeUser(user: User) {
    const { password, resetPasswordToken, resetPasswordExpires, currentHashedRefreshToken, otp, otpExpires, ...sanitized } = user as any;
    return sanitized;
  }
}
