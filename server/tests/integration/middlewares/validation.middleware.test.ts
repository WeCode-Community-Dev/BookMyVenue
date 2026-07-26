import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { validateBody, validateParams, validateQuery } from '../../../src/middlewares/validation.middleware';

describe('Validation Middleware', () => {
  const app = express();
  app.use(express.json());

  const sampleSchema = z.object({
    name: z.string().min(3),
    age: z.number().min(18),
  });

  const paramsSchema = z.object({
    id: z.string().min(5),
  });

  const querySchema = z.object({
    page: z.string().transform(Number),
  });

  app.post('/test-body', validateBody(sampleSchema), (req, res) => {
    res.status(200).json({ success: true, validated: req.validated?.body });
  });

  app.get('/test-params/:id', validateParams(paramsSchema), (req, res) => {
    res.status(200).json({ success: true, validated: req.validated?.params });
  });

  app.get('/test-query', validateQuery(querySchema), (req, res) => {
    res.status(200).json({ success: true, validated: req.validated?.query });
  });

  it('should allow valid request body and populate req.validated', async () => {
    const response = await request(app)
      .post('/test-body')
      .send({ name: 'Alice', age: 25 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.validated).toEqual({ name: 'Alice', age: 25 });
  });

  it('should reject invalid request body with HTTP 400', async () => {
    const response = await request(app)
      .post('/test-body')
      .send({ name: 'Al', age: 15 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should validate params correctly', async () => {
    const response = await request(app).get('/test-params/12345');
    expect(response.status).toBe(200);

    const invalidResponse = await request(app).get('/test-params/12');
    expect(invalidResponse.status).toBe(400);
  });

  it('should validate and transform query params', async () => {
    const response = await request(app).get('/test-query?page=2');
    expect(response.status).toBe(200);
    expect(response.body.validated).toEqual({ page: 2 });
  });
});
