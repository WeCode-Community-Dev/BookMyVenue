import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';
import { createAuthenticatedSession } from '../../helpers/auth.helper';

describe('User API Routes', () => {
  describe('GET /api/v1/user/profile', () => {
    it('should return 401 when access token cookie is missing', async () => {
      const response = await request(app).get('/api/v1/user/profile');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return authenticated user profile when cookie is present', async () => {
      const session = await createAuthenticatedSession();

      const response = await request(app)
        .get('/api/v1/user/profile')
        .set('Cookie', [session.cookieHeader]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(session.user.email);
      expect(response.body.data.name).toBe(session.user.username);
    });
  });

  describe('PATCH /api/v1/user/profile', () => {
    it('should update user profile successfully', async () => {
      const session = await createAuthenticatedSession();

      const response = await request(app)
        .patch('/api/v1/user/profile')
        .set('Cookie', [session.cookieHeader])
        .send({
          username: 'updatedname',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('updatedname');
    });
  });
});
