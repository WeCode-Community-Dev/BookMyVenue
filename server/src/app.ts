import compression from 'compression';
import cors from 'cors';
import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { corsOptions } from './configs/cors.config';
import router from './router';
import { ResponseUtil } from './utils/responseUtils';
import { requestLogger, logError } from './utils/logger';
import { webhookRouter } from './modules/webhook/webhook.router';

const app: Express = express();

// Trust the first proxy hop so express-rate-limit can read X-forwarded-For
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  })
);

// ─── WEBHOOK: Mount BEFORE express.json() ──────────────────────────────────
// Razorpay HMAC-SHA256 verification requires the raw request body as a Buffer.
app.use('/api/v1/webhook', webhookRouter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS and cookies
app.use(cors(corsOptions));
app.use(cookieParser());

// Compression middleware
app.use(compression({ threshold: 1024 }));

// Cache control
app.use(express.static('public'));

app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// HTTP request logging
app.use(requestLogger);

// Router
app.use('/api/v1', router);

// 404 Handler
app.use((_req: Request, res: Response) => {
  ResponseUtil.notFound(res, 'Route/Method not found');
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logError('Unhandled Express error', { error: err.message, stack: err.stack });
  ResponseUtil.internalServerError(res, 'Internal server error');
});

export { app };
