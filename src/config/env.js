import 'dotenv/config';

const required = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];

export function loadEnv() {
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}
