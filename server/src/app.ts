import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import logger from '@/libs/logger';
import notFound from '@/utils/notFound';
import errorMiddleware from '@/middlewares/error.middleware';
import routes from '@/routes';
import env from './configs/env.config';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS — allowlist validation (CVE-BMV-007: prevent wildcard default)
const allowedOrigins = env.CORS_ORIGIN
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no Origin header) only in development
      if (!origin && env.NODE_ENV === 'development') return callback(null, true);
      if (origin && allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin '${origin}' not allowed by CORS policy`));
    },
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
  })
);

app.use(
  pinoHttp({
    logger,

    serializers: {
      req: () => undefined,
      res: () => undefined,
    },

    customLogLevel(req, res, err) {
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },

    customErrorMessage: () => '',
    customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
  })
);

// JSON parser & Form data parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser (required for reading req.cookies in auth routes)
app.use(cookieParser());

// Health Check
app.get('/health', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// ── Rate Limiters (CVE-BMV-004) ─────────────────────────────────────────────
// Applied per-route below; keeping limits conservative to prevent brute-force
// and OTP oracle attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { success: false, message: 'Too many auth attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip ?? 'unknown',
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: { success: false, message: 'Too many OTP requests. Please wait 5 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip ?? 'unknown',
});

app.use('/api/auth/signin', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/verify-otp', otpLimiter);
app.use('/api/auth/resend-otp', otpLimiter);
app.use('/api/auth/verify-forgot-password-otp', otpLimiter);

app.use('/api', routes);

app.use(notFound);
app.use(errorMiddleware);

export default app;
