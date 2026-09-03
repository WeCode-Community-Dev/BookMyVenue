import type { CorsOptions } from 'cors';
import { corsConfig, nodeEnv } from '../constants/env';

const BASE_ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'Accept',
  'Accept-Language',
  'X-Requested-With',
] as const;

export function mergeAllowedHeaders(customHeaders: string[]): string[] {
  return Array.from(new Set([...BASE_ALLOWED_HEADERS, ...customHeaders]));
}

function validateProductionOrigins(origins: string[]): void {
  for (const origin of origins) {
    const url = new URL(origin);
    if (url.protocol !== 'https:') {
      throw new Error(`Non-HTTPS CORS origin in production: ${origin}`);
    }
  }
}

function buildOrigin(): string[] {
  const origins = corsConfig.allowedOrigins;
  if (nodeEnv === 'production') {
    validateProductionOrigins(origins);
  }
  return origins;
}

export const corsOptions: CorsOptions = {
  origin: buildOrigin(),
  allowedHeaders: mergeAllowedHeaders(corsConfig.allowedHeaders),
  credentials: true,
  optionsSuccessStatus: 204,
};