import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';
import { ProcessedWebhookModel } from '../../../src/modules/booking/models/processedWebhook.model';
import {
  generateRazorpaySignature,
  createMockRazorpayPaymentCapturedPayload,
  TEST_WEBHOOK_SECRET,
} from '../../helpers/webhook.helper';

// Ensure the unique index on ProcessedWebhooks.eventId is created before tests run.
// mongodb-memory-server may create indexes asynchronously, causing the idempotency
// gate to miss duplicate key errors in the duplicate webhook test.
beforeAll(async () => {
  await ProcessedWebhookModel.createIndexes();
});

describe('Razorpay Webhook API Routes', () => {
  describe('POST /api/v1/webhook/razorpay', () => {
    it('should reject requests missing the x-razorpay-signature header', async () => {
      const payload = createMockRazorpayPaymentCapturedPayload();
      const rawBody = JSON.stringify(payload);

      const response = await request(app)
        .post('/api/v1/webhook/razorpay')
        .set('Content-Type', 'application/json')
        .send(rawBody);

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(false);
      expect(response.body.error).toBe('Missing x-razorpay-signature header');
    });

    it('should reject requests with invalid HMAC signatures', async () => {
      const payload = createMockRazorpayPaymentCapturedPayload();
      const rawBody = JSON.stringify(payload);
      const invalidSignature = 'invalid_hmac_signature_hash_1234567890';

      const response = await request(app)
        .post('/api/v1/webhook/razorpay')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', invalidSignature)
        .send(rawBody);

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(false);
      expect(response.body.error).toBe('Invalid webhook signature');
    });

    it('should ignore non-payment.captured events', async () => {
      const payload = createMockRazorpayPaymentCapturedPayload({ event: 'payment.failed' });
      const rawBody = JSON.stringify(payload);
      const signature = generateRazorpaySignature(rawBody, TEST_WEBHOOK_SECRET);

      const response = await request(app)
        .post('/api/v1/webhook/razorpay')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', signature)
        .send(rawBody);

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });

    it('should return 200 (with error) for a valid webhook with invalid notes metadata', async () => {
      const payload = createMockRazorpayPaymentCapturedPayload({
        notes: { foo: 'bar' },
      });
      const rawBody = JSON.stringify(payload);
      const signature = generateRazorpaySignature(rawBody, TEST_WEBHOOK_SECRET);

      const response = await request(app)
        .post('/api/v1/webhook/razorpay')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', signature)
        .send(rawBody);

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });

    it('should handle duplicate webhook events idempotently', async () => {
      const payload = createMockRazorpayPaymentCapturedPayload();
      const rawBody = JSON.stringify(payload);
      const signature = generateRazorpaySignature(rawBody, TEST_WEBHOOK_SECRET);

      // First request — process normally
      const firstResponse = await request(app)
        .post('/api/v1/webhook/razorpay')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', signature)
        .send(rawBody);

      expect(firstResponse.status).toBe(200);
      expect(firstResponse.body.received).toBe(true);

      // Second request — should be detected as duplicate and return idempotent: true
      const secondResponse = await request(app)
        .post('/api/v1/webhook/razorpay')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', signature)
        .send(rawBody);

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body.idempotent).toBe(true);
    });
  });
});
