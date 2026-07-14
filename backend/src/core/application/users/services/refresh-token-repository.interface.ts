export interface IRefreshTokenRepository {
  save(userId: string, rawToken: string, expiresAt: Date): Promise<void>;
  verify(userId: string, rawToken: string): Promise<boolean>;
  deleteByUserId(userId: string): Promise<void>;
}
