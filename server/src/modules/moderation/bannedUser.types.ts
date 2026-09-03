import type { BanScope } from './bannedUser.model';

export interface CreateBanRequest {
  userId: string;
  scope: BanScope;
  reason: string;
  venueId?: string;
  expiresAt?: string;
}
