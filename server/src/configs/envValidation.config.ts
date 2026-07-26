import { z } from 'zod';
import { logError, logInfo } from '../utils/logger';
import { nodeEnv } from '../constants/env';

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ISSUER: z.string().min(1, 'JWT_ISSUER is required'),
  JWT_AUDIENCE: z.string().min(1, 'JWT_AUDIENCE is required'),
  RAZORPAY_KEY_ID: z.string().min(1, 'RAZORPAY_KEY_ID is required'),
  RAZORPAY_KEY_SECRET: z.string().min(1, 'RAZORPAY_KEY_SECRET is required'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  PORT: z.coerce.number().positive().optional(),
});

const productionEnvSchema = envSchema.extend({
  SWAGGER_USER: z.string().min(1, 'SWAGGER_USER is required in production'),
  SWAGGER_PASS: z.string().min(1, 'SWAGGER_PASS is required in production'),
});

export function validateEnv(): void {
  const schema = nodeEnv === 'production' ? productionEnvSchema : envSchema;
  const result = schema.safeParse(process.env);

  if (!result.success) {
    const errorMessages: string[] = [];
    for (const issue of result.error.issues) {
      const path = issue.path.length > 0 ? String(issue.path[0]) : 'unknown';
      errorMessages.push(`${path}: ${issue.message}`);
    }
    logError('Environment validation failed', { errors: errorMessages });
    process.exit(1);
  }

  logInfo('Env validated');
}
