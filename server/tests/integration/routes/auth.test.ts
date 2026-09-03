import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';
import { createTestUser } from '../../helpers/db.helper';

describe('Auth API Routes', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'newuser123',
          email: 'newuser123@example.com',
          password: 'Password@123',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 when invalid registration data is provided', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'usr',
          email: 'invalid-email',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should log in successfully with valid credentials', async () => {
      const password = 'Password@123';
      const user = await createTestUser({ password });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const user = await createTestUser({ password: 'Password@123' });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password: 'WrongPassword@123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should return 401 when refresh token cookie is missing', async () => {
      const response = await request(app).post('/api/v1/auth/refresh');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should refresh access token when valid refresh cookie is sent', async () => {
      const password = 'Password@123';
      const user = await createTestUser({ password });

      // Perform login to get cookies
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password });

      const cookies = loginRes.headers['set-cookie'] as string[];
      expect(cookies).toBeDefined();

      const refreshRes = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', cookies);

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should log out user and clear session cookies', async () => {
      const password = 'Password@123';
      const user = await createTestUser({ password });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password });

      const cookies = loginRes.headers['set-cookie'] as string[];

      const logoutRes = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', cookies);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should accept valid email and return success', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: user.email });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'not-an-email' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/sessions', () => {
    it('should list active sessions for logged in user', async () => {
      const password = 'Password@123';
      const user = await createTestUser({ password });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password });

      const cookies = loginRes.headers['set-cookie'] as string[];

      const sessionsRes = await request(app)
        .get('/api/v1/auth/sessions')
        .set('Cookie', cookies);

      expect(sessionsRes.status).toBe(200);
      expect(sessionsRes.body.success).toBe(true);
      expect(Array.isArray(sessionsRes.body.data)).toBe(true);
    });
  });
});
