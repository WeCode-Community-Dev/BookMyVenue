import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';

describe('Venue API Routes', () => {
  describe('GET /api/v1/venues', () => {
    it('should return paginated active venues list', async () => {
      const response = await request(app).get('/api/v1/venues');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.venues)).toBe(true);
    });

    it('should accept pagination and filter query parameters', async () => {
      const response = await request(app).get('/api/v1/venues?page=1&limit=5&city=Mumbai');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/venues/pins', () => {
    it('should return empty venue pins array when no venues exist', async () => {
      const response = await request(app).get('/api/v1/venues/pins');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/venues/featured', () => {
    it('should return featured venues array', async () => {
      const response = await request(app).get('/api/v1/venues/featured');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
