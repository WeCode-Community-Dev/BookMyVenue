import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { idempotencyMiddleware } from '../../src/middlewares/idempotency.middleware';
import { IdempotencyKeyModel } from '../../src/models/idempotency-key.model';

describe('idempotencyMiddleware', () => {
  beforeEach(async () => {
    await IdempotencyKeyModel.deleteMany({});
  });

  it('should pass through when no Idempotency-Key header is present', async () => {
    const app = express();
    app.use(express.json());
    app.post('/test', idempotencyMiddleware(), (_req, res) => {
      res.status(200).json({ success: true });
    });

    const response = await request(app).post('/test').send({});

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should cache the response and replay it on the same key', async () => {
    const app = express();
    app.use(express.json());
    app.post('/test', idempotencyMiddleware(), (_req, res) => {
      res.status(422).json({ success: false, message: 'validation error' });
    });

    const first = await request(app)
      .post('/test')
      .set('Idempotency-Key', 'unit-test-replay')
      .send({});

    expect(first.status).toBe(422);
    expect(first.body).toEqual({ success: false, message: 'validation error' });

    const cacheEntry = await IdempotencyKeyModel.findOne({ key: 'unit-test-replay' }).lean().exec();
    expect(cacheEntry).toBeTruthy();
    expect(cacheEntry?.response.status).toBe(422);
    expect(cacheEntry?.response.body).toEqual({ success: false, message: 'validation error' });

    const second = await request(app)
      .post('/test')
      .set('Idempotency-Key', 'unit-test-replay')
      .send({});

    expect(second.status).toBe(first.status);
    expect(second.body).toEqual(first.body);
  });

  it('should not cache 5xx responses', async () => {
    const app = express();
    app.use(express.json());
    app.post('/test', idempotencyMiddleware(), (_req, res) => {
      res.status(500).json({ success: false, message: 'Internal server error' });
    });

    const first = await request(app)
      .post('/test')
      .set('Idempotency-Key', 'unit-test-5xx')
      .send({});

    expect(first.status).toBe(500);

    const cacheEntry = await IdempotencyKeyModel.findOne({ key: 'unit-test-5xx' }).lean().exec();
    expect(cacheEntry).toBeNull();
  });

  it('should treat different keys as independent requests', async () => {
    const callOrder: number[] = [];
    const app = express();
    app.use(express.json());
    app.post('/test', idempotencyMiddleware(), (_req, res) => {
      callOrder.push(1);
      res.status(200).json({ success: true });
    });

    await request(app)
      .post('/test')
      .set('Idempotency-Key', 'key-a')
      .send({});

    await request(app)
      .post('/test')
      .set('Idempotency-Key', 'key-b')
      .send({});

    expect(callOrder).toHaveLength(2);

    const count = await IdempotencyKeyModel.countDocuments({
      key: { $in: ['key-a', 'key-b'] },
    });
    expect(count).toBe(2);
  });
});
