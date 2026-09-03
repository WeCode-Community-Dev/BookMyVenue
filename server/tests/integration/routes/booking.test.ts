import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';
import { createAuthenticatedSession } from '../../helpers/auth.helper';
import { IdempotencyKeyModel } from '../../../src/models/idempotency-key.model';

describe('Booking API Routes', () => {
  describe('GET /api/v1/bookings/my-bookings', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/v1/bookings/my-bookings');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return user bookings list when authenticated', async () => {
      const session = await createAuthenticatedSession();

      const response = await request(app)
        .get('/api/v1/bookings/my-bookings')
        .set('Cookie', [session.cookieHeader]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should accept pagination and status filter query parameters', async () => {
      const session = await createAuthenticatedSession();

      const response = await request(app)
        .get('/api/v1/bookings/my-bookings?page=1&limit=5&status=confirmed')
        .set('Cookie', [session.cookieHeader]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/bookings/checkout', () => {
    it('should return 400 or unauthorized/forbidden when lockId payload is invalid', async () => {
      const session = await createAuthenticatedSession();

      const response = await request(app)
        .post('/api/v1/bookings/checkout')
        .set('Cookie', [session.cookieHeader])
        .send({ lockId: 'invalid-id' });

      expect([400, 401, 403]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Idempotency-Key handling on POST /api/v1/bookings/checkout', () => {
    it('should cache the response and replay it on the same key', async () => {
      const session = await createAuthenticatedSession();
      const key = 'booking-test-replay-key';

      const first = await request(app)
        .post('/api/v1/bookings/checkout')
        .set('Cookie', [session.cookieHeader])
        .set('Idempotency-Key', key)
        .send({ lockId: 'invalid-id' });

      expect([400, 401, 403]).toContain(first.status);
      expect(first.body.success).toBe(false);

      const cacheEntry = await IdempotencyKeyModel.findOne({ key }).lean().exec();
      expect(cacheEntry).toBeTruthy();
      expect(cacheEntry?.response.status).toBe(first.status);

      const second = await request(app)
        .post('/api/v1/bookings/checkout')
        .set('Cookie', [session.cookieHeader])
        .set('Idempotency-Key', key)
        .send({ lockId: 'invalid-id' });

      expect(second.status).toBe(first.status);
      expect(second.body).toEqual(first.body);
    });

    it('should pass through when no Idempotency-Key header is present', async () => {
      const session = await createAuthenticatedSession();

      const response = await request(app)
        .post('/api/v1/bookings/checkout')
        .set('Cookie', [session.cookieHeader])
        .send({ lockId: 'invalid-id' });

      expect([400, 401, 403]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('should treat different idempotency keys as independent requests', async () => {
      const session = await createAuthenticatedSession();

      const responseA = await request(app)
        .post('/api/v1/bookings/checkout')
        .set('Cookie', [session.cookieHeader])
        .set('Idempotency-Key', 'key-independent-a')
        .send({ lockId: 'invalid-id' });

      expect([400, 401, 403]).toContain(responseA.status);

      const responseB = await request(app)
        .post('/api/v1/bookings/checkout')
        .set('Cookie', [session.cookieHeader])
        .set('Idempotency-Key', 'key-independent-b')
        .send({ lockId: 'invalid-id' });

      expect([400, 401, 403]).toContain(responseB.status);

      const count = await IdempotencyKeyModel.countDocuments({
        key: { $in: ['key-independent-a', 'key-independent-b'] },
      });
      expect(count).toBe(2);
    });
  });

  describe('GET /api/v1/bookings/:bookingRefId', () => {
    it('should return 404 or authorization error for a non-existent booking reference ID', async () => {
      const session = await createAuthenticatedSession();
      const fakeRefId = 'BMV-999999';

      const response = await request(app)
        .get(`/api/v1/bookings/${fakeRefId}`)
        .set('Cookie', [session.cookieHeader]);

      expect([401, 403, 404]).toContain(response.status);
    });
  });
});
