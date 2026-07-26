import { describe, it, expect, vi } from 'vitest';
import type { Response } from 'express';
import { ResponseUtil } from '../../src/utils/responseUtils';

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('ResponseUtil', () => {
  it('should format success response correctly', () => {
    const res = mockResponse();
    ResponseUtil.success(res, 'Success message', { key: 'value' });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Success message',
      data: { key: 'value' },
    });
  });

  it('should format created response with HTTP status 201', () => {
    const res = mockResponse();
    ResponseUtil.created(res, 'Item created', { id: 1 });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Item created',
      data: { id: 1 },
    });
  });

  it('should format notFound response with HTTP status 404', () => {
    const res = mockResponse();
    ResponseUtil.notFound(res, 'User not found');

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
    });
  });

  it('should format badRequest response with HTTP status 400', () => {
    const res = mockResponse();
    ResponseUtil.badRequest(res, 'Invalid input', 'Validation error');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid input',
      error: 'Validation error',
    });
  });

  it('should format unauthorized response with HTTP status 401', () => {
    const res = mockResponse();
    ResponseUtil.unauthorized(res, 'Token missing');

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token missing',
    });
  });

  it('should format forbidden response with HTTP status 403', () => {
    const res = mockResponse();
    ResponseUtil.forbidden(res, 'Access denied');

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access denied',
    });
  });

  it('should format internalServerError response with HTTP status 500', () => {
    const res = mockResponse();
    ResponseUtil.internalServerError(res, 'Database crash');

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Database crash',
    });
  });
});
