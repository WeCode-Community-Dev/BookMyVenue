import type { CorsOptions } from 'cors';
import { corsConfig, nodeEnv } from '../constants/env';

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
  ...(corsConfig.allowedHeaders.length > 0
    ? { allowedHeaders: corsConfig.allowedHeaders }
    : {}),
  credentials: true,
  optionsSuccessStatus: 204,
};
