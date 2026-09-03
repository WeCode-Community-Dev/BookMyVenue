import type { IRefreshToken } from '../modules/auth/models/refresh-token.model';
import type { IPermission } from '../constants/permissions';
import type { PaginationParams } from './pagination.types';

export type StoredToken = IRefreshToken;

export interface VerifiedRole {
  id?: string;
  name?: string;
  isSuperAdmin?: boolean;
  permissions?: Set<IPermission>;
}

export interface AuthenticatedUser {
  userId: string;
  username: string;
  email: string;
  role: VerifiedRole;
}

export type Permission = IPermission;

export interface DecodedToken {
  id: string;
  jti: string;
}

export interface TokenPayload {
  id: string;
  username: string;
  email: string;
  iat: number;
  jti?: string;
}

export interface RefreshTokenPayload {
  id: string;
  iat?: number;
  jti: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: string;
}

export interface ValidatedRequest {
  body?: unknown;
  params?: unknown;
  query?: unknown;
}

export interface RequestToken {
  decoded: DecodedToken;
  stored: IRefreshToken;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      token?: RequestToken;
      validated?: ValidatedRequest;
      pagination?: PaginationParams;
    }
  }
}
