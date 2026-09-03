import crypto from 'crypto';
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openapiDocument } from './swagger.config';
import { swaggerConfig, nodeEnv } from '../../constants/env';

const router: Router = Router();

// Only serve Swagger UI in development
function devOnly(_req: Request, res: Response, next: NextFunction): void {
  if (nodeEnv !== 'development') {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  next();
}

// Basic Auth guard for the Swagger UI
function basicAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger UI"');
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  // Reject if credentials are not configured
  if (!swaggerConfig.user || !swaggerConfig.pass) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger UI"');
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const base64 = authHeader.slice('Basic '.length);
  const decoded = Buffer.from(base64, 'base64').toString('utf8');
  const [user, ...rest] = decoded.split(':');
  const pass = rest.join(':');

  // Hash both sides to a fixed-length digest before comparing.
  // crypto.timingSafeEqual throws a RangeError when buffer lengths differ,
  // which happens on virtually every wrong-password attempt. HMAC-SHA256
  // normalises both operands to 32 bytes while preserving timing safety.
  const HMAC_KEY = Buffer.from('swagger-basic-auth-comparison-key');
  const hash = (s: string): Buffer => crypto.createHmac('sha256', HMAC_KEY).update(s).digest();

  const userMatch = crypto.timingSafeEqual(hash(user), hash(swaggerConfig.user));
  const passMatch = crypto.timingSafeEqual(hash(pass), hash(swaggerConfig.pass));

  if (!userMatch || !passMatch) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger UI"');
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  next();
}

// Expose the raw OpenAPI JSON for Postman / import
router.get('/json', devOnly, basicAuth, (_req, res) => {
  res.json(openapiDocument);
});

// Mount the Swagger UI
router.use('/', devOnly, basicAuth, swaggerUi.serve);
router.get(
  '/',
  devOnly,
  basicAuth,
  swaggerUi.setup(openapiDocument, {
    customSiteTitle: 'BookMyVenue API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
    },
  })
);

export { router as swaggerRouter };
