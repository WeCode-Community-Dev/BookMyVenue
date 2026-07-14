import { Injectable, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { type ITokenService } from '../services/token.interface';
import { type IRefreshTokenRepository } from '../services/refresh-token-repository.interface';
import { BusinessRuleException } from '../../../domain/_shared/exception/business-rule.exception';

export interface RefreshAccessTokenDto {
  refreshToken: string;
}

export interface RefreshAccessTokenResultDto {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshAccessTokenCommand {
  constructor(
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(dto: RefreshAccessTokenDto): Promise<RefreshAccessTokenResultDto> {
    const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
    if (!payload) {
      throw new BusinessRuleException('Invalid or expired refresh token');
    }

    const isValid = await this.refreshTokenRepository.verify(payload.userId, dto.refreshToken);
    if (!isValid) {
      throw new BusinessRuleException('Invalid or expired refresh token');
    }

    const newPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    const accessToken = this.tokenService.generateAccessToken(newPayload);
    const refreshToken = this.tokenService.generateRefreshToken(newPayload);

    await this.refreshTokenRepository.deleteByUserId(payload.userId);

    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
    const expiresAt = decoded.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepository.save(payload.userId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }
}
