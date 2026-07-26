import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';

describe('GET /api/v1/health', () => {
  it('should return 200 OK with health status message', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Service is healthy');
  });

  it('should return 404 for unknown endpoints', async () => {
    const response = await request(app).get('/api/v1/unknown-endpoint-xyz');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Route/Method not found');
  });
});
