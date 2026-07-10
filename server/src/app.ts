import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import logger from '@/libs/logger';
import notFound from '@/utils/notFound';
import errorHandler from './utils/error';
import routes from '@/routes';
import env from './configs/env.config';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
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

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
