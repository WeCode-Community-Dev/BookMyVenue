import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PhoneOtp } from './entities/phone-otp.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { generateOtp } from './otp.util';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

const OTP_TTL_MINUTES = 5;

/** Short-lived access token — stateless, fast to verify. */
const ACCESS_TOKEN_TTL = '15m';

/** Long-lived refresh token — stored hashed in DB, fully revocable. */
const REFRESH_TOKEN_TTL_DAYS = 7;

/** How long the phone-verified token is valid (must complete registration in this window). */
const PHONE_TOKEN_TTL = '10m';

/** Shared token-pair type returned by login, register, and refresh. */
export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // access token TTL in seconds (for the client timer)
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PhoneOtp)
    private readonly phoneOtpRepo: Repository<PhoneOtp>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  // ─────────────────────────────────────────────────────────────────────────
  // Internal helpers
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Hashes a raw token with SHA-256.
   * Only the hash is stored in the DB — the raw token lives only in memory.
   */
  private hashToken(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  /**
   * Issues a short-lived access token + a long-lived refresh token.
   *
   * The raw refresh token is returned to the caller ONCE and never persisted.
   * Only its SHA-256 hash is saved to `refresh_tokens`.
   * Rotation: every call to this method creates a NEW DB row.
   */
  async issueTokenPair(userId: string, role: UserRole): Promise<TokenPair> {
    // Access token — signed JWT, valid for 15 minutes
    const accessToken = this.jwtService.sign(
      { sub: userId, role, purpose: 'access' },
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // Refresh token — 256-bit cryptographically random value (64 hex chars)
    const rawRefreshToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({ userId, tokenHash, expiresAt }),
    );

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 15 * 60, // 900 seconds
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // OTP Flow (Steps 1 & 2 of signup)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Step 1 — Generate a 6-digit OTP, persist it, and send via SMS.
   * Any previous OTP for this phone is deleted first.
   */
  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const { phone } = dto;

    await this.phoneOtpRepo.delete({ phone });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await this.phoneOtpRepo.save(
      this.phoneOtpRepo.create({ phone, otpCode: otp, expiresAt }),
    );

    // TODO: Replace with real SMS provider (e.g. Twilio / Fast2SMS)
    console.log(`[OTP] Phone: ${phone}  Code: ${otp}  Expires: ${expiresAt.toISOString()}`);

    return { message: 'OTP sent successfully. It expires in 5 minutes.' };
  }

  /**
   * Step 2 — Verify the OTP.
   * On success the OTP record is deleted and a 10-minute phoneVerifiedToken is returned.
   * The frontend must include this token in the /users/register body.
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<{
    verified: boolean;
    phone: string;
    phoneVerifiedToken: string;
  }> {
    const { phone, otp } = dto;

    const record = await this.phoneOtpRepo.findOne({
      where: { phone, expiresAt: MoreThan(new Date()) },
      order: { createdAt: 'DESC' },
    });

    if (!record) {
      throw new UnauthorizedException(
        'OTP not found or has expired. Please request a new OTP.',
      );
    }

    if (record.otpCode !== otp) {
      throw new UnauthorizedException('Invalid OTP. Please try again.');
    }

    await this.phoneOtpRepo.delete(record.id);

    const phoneVerifiedToken = this.jwtService.sign(
      { phone, purpose: 'phone_verification' },
      { expiresIn: PHONE_TOKEN_TTL },
    );

    return { verified: true, phone, phoneVerifiedToken };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Signin Flow
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /auth/login — Sign in with email + password.
   *
   * Returns a token pair:
   *   - accessToken  (15 min) — use in Authorization: Bearer header
   *   - refreshToken (7 days) — store securely, use to get new accessToken
   *
   * Generic error message prevents user enumeration.
   */
  async login(dto: LoginDto): Promise<
    TokenPair & {
      user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        role: UserRole;
        isProfileCompleted: boolean;
      };
    }
  > {
    const { email, password } = dto;
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated. Please contact support.',
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const tokens = await this.issueTokenPair(user.id, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isProfileCompleted: user.isProfileCompleted,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Token Management
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /auth/refresh — Rotate tokens.
   *
   * Accepts the current refresh token and:
   *   1. Validates it exists in DB and is not expired.
   *   2. Deletes the old token (rotation — prevents token reuse).
   *   3. Issues and returns a fresh token pair.
   *
   * If the refresh token has already been used (not in DB), it likely
   * indicates a stolen token. Throw immediately.
   */
  async refresh(dto: RefreshTokenDto): Promise<TokenPair> {
    const tokenHash = this.hashToken(dto.refreshToken);

    const record = await this.refreshTokenRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!record) {
      throw new UnauthorizedException(
        'Refresh token is invalid. Please log in again.',
      );
    }

    if (record.expiresAt < new Date()) {
      // Clean up the expired record
      await this.refreshTokenRepo.delete(record.id);
      throw new UnauthorizedException(
        'Refresh token has expired. Please log in again.',
      );
    }

    if (!record.user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated.');
    }

    // Rotate: delete the old token, issue a new pair
    await this.refreshTokenRepo.delete(record.id);
    return this.issueTokenPair(record.userId, record.user.role);
  }

  /**
   * POST /auth/logout — Invalidate a specific session.
   *
   * Deletes the refresh token from DB — the client's access token will
   * expire on its own within 15 minutes (acceptable window for stateless JWTs).
   * For immediate access token revocation, a token blacklist (Redis) is needed.
   */
  async logout(dto: RefreshTokenDto): Promise<{ message: string }> {
    const tokenHash = this.hashToken(dto.refreshToken);
    await this.refreshTokenRepo.delete({ tokenHash });
    return { message: 'Logged out successfully.' };
  }
}
