import { Injectable, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { type IUserRepository } from '../../../domain/users/repositories/user-repository.interface';
import { type IPasswordHasher } from '../services/password-hasher.interface';
import { type ITokenService } from '../services/token.interface';
import { type IRefreshTokenRepository } from '../services/refresh-token-repository.interface';
import { BusinessRuleException } from '../../../domain/_shared/exception/business-rule.exception';
import { NotFoundException } from '../../../domain/_shared/exception/notfound.exception';
import type { UserRole } from 'src/core/domain/_shared/enum/UserRole';

export interface LoginUserDto {
  email: string;
  password?: string;
}

export interface LoginResultDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    role: string;
  };
}

@Injectable()
export class LoginUserCommand {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) { }

  async execute(dto: LoginUserDto): Promise<LoginResultDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status === 'BLOCKED') {
      throw new BusinessRuleException('Your account has been blocked');
    }
    if (user.status === 'DELETED') {
      throw new BusinessRuleException('Your account has been deleted');
    }

    // Standard credential login
    if (dto.password) {
      if (!user.password) {
        throw new BusinessRuleException('Invalid credentials (please use Google login)');
      }
      const isMatch = await this.passwordHasher.compare(dto.password, user.password);
      if (!isMatch) {
        throw new BusinessRuleException('Invalid credentials');
      }
    } else {
      // Social login check would be handled by another mechanism or pass through
      throw new BusinessRuleException('Password is required');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    await this.refreshTokenRepository.deleteByUserId(user.id);

    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
    const expiresAt = decoded.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepository.save(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || null,
        role: user.role,
      },
    };
  }
}
