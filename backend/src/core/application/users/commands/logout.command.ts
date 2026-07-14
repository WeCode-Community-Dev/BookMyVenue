import { Injectable, Inject } from '@nestjs/common';
import { type IRefreshTokenRepository } from '../services/refresh-token-repository.interface';

export interface LogoutDto {
  userId: string;
}

@Injectable()
export class LogoutCommand {
  constructor(
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(dto: LogoutDto): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(dto.userId);
  }
}
