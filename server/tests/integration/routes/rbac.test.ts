import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';
import { createAuthenticatedSession } from '../../helpers/auth.helper';

describe('RBAC & Authorization Middleware API Routes', () => {
  describe('Admin-only Route Restrictions', () => {
    it('should reject unauthenticated request with 401 Unauthorized', async () => {
      const response = await request(app).get('/api/v1/bookings/all');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should deny non-admin standard user with 401/403 on admin booking list', async () => {
      const session = await createAuthenticatedSession();

      const response = await request(app)
        .get('/api/v1/bookings/all')
        .set('Cookie', [session.cookieHeader]);

      expect([401, 403]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('should deny non-admin standard user with 401/403 on ban user endpoint', async () => {
      const session = await createAuthenticatedSession();

      const response = await request(app)
        .post('/api/v1/user/60d5ecb8b392d40015f8a999/ban')
        .set('Cookie', [session.cookieHeader])
        .send({ banReason: 'Violation of terms' });

      expect([401, 403]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });
});
