import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma/prisma.service';
import type { IRefreshTokenRepository } from '../../core/application/users/services/refresh-token-repository.interface';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  private hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  async save(userId: string, rawToken: string, expiresAt: Date): Promise<void> {
    await this.prisma.refresh_tokens.create({
      data: {
        id: crypto.randomUUID(),
        user_id: userId,
        token_hash: this.hashToken(rawToken),
        expires_at: expiresAt,
      },
    });
  }

  async verify(userId: string, rawToken: string): Promise<boolean> {
    const record = await this.prisma.refresh_tokens.findFirst({
      where: {
        user_id: userId,
        token_hash: this.hashToken(rawToken),
        expires_at: { gt: new Date() },
      },
    });
    return record !== null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refresh_tokens.deleteMany({
      where: { user_id: userId },
    });
  }
}
