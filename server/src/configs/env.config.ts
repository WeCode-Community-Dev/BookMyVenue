import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: path.resolve('.env'),
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(10),

  JWT_REFRESH_SECRET: z.string().min(10),

  JWT_REGISTRATION_SECRET: z.string().min(10),

  CORS_ORIGIN: z.string().default('*'),

  GOOGLE_CLIENT_ID: z.string().min(1),

  GOOGLE_CLIENT_SECRET: z.string().min(1),

  GOOGLE_CALLBACK_URL: z.string(),

  CLOUDINARY_URL: z.string(),

  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // SMTP / Email
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),

  // OTP settings
  OTP_EXPIRY_SECONDS: z.coerce.number().default(300),
  RESEND_COOLDOWN_SECONDS: z.coerce.number().default(60),
  MAX_VERIFY_ATTEMPTS: z.coerce.number().default(5),
  MAX_RESEND_COUNT: z.coerce.number().default(3),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;
