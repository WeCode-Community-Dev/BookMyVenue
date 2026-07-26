import type jwt from 'jsonwebtoken';

export const nodeEnv = process.env.NODE_ENV ?? 'development';

export const resendConfig = {
  get apiKey(): string | undefined {
    return process.env.RESEND_API_KEY;
  },
  get fromName(): string | undefined {
    return process.env.EMAIL_FROM_NAME;
  },
  get fromEmail(): string | undefined {
    return process.env.EMAIL_FROM_EMAIL;
  },
  get devToEmail(): string | undefined {
    return process.env.RESEND_DEV_RECIPIENT;
  },
  get appName(): string {
    return process.env.APP_NAME ?? 'BookMyVenue';
  },
  get frontendUrl(): string | undefined {
    return process.env.FRONTEND_URL;
  },
  get serverUrl(): string {
    return process.env.SERVER_URL ?? 'http://localhost:3003';
  },
  get logoUrl(): string {
    const base = process.env.SERVER_URL ?? 'http://localhost:3003';
    return `${base}/images/bmv-logo.png`;
  },
};

export const jwtConfig = {
  get issuer(): string {
    return process.env.JWT_ISSUER ?? 'BookMyVenue';
  },
  get audience(): string {
    return process.env.JWT_AUDIENCE ?? 'BookMyVenue';
  },
  get algorithm(): jwt.Algorithm {
    return (process.env.JWT_ALGORITHM ?? 'HS256') as jwt.Algorithm;
  },
};

export const razorpayConfig = {
  get keyId(): string | undefined {
    return process.env.RAZORPAY_KEY_ID;
  },
  get keySecret(): string | undefined {
    return process.env.RAZORPAY_KEY_SECRET;
  },
  get webhookSecret(): string | undefined {
    return process.env.RAZORPAY_WEBHOOK_SECRET;
  },
};

export const authEnvs = {
  get accessTokenExpiry(): string {
    return process.env.ACCESS_TOKEN_EXPIRY ?? '30m';
  },
  get refreshTokenExpiry(): string {
    return process.env.REFRESH_TOKEN_EXPIRY ?? '7d';
  },
  get accessTokenSecret(): string | undefined {
    return process.env.JWT_ACCESS_SECRET;
  },
  get refreshTokenSecret(): string | undefined {
    return process.env.JWT_REFRESH_SECRET;
  },
};

export const swaggerConfig = {
  get user(): string | undefined {
    return process.env.SWAGGER_USER;
  },
  get pass(): string | undefined {
    return process.env.SWAGGER_PASS;
  },
};
