import { describe, it, expect, beforeEach } from 'vitest';

describe('getSafeRedirectUrl', () => {
  beforeEach(() => {
    window.location = { origin: 'http://localhost:5173' } as unknown as Location;
  });

  it('should return fallback for null or undefined', async () => {
    const { getSafeRedirectUrl } = await import('../../utils/redirect');
    expect(getSafeRedirectUrl(null)).toBe('/');
    expect(getSafeRedirectUrl(null, '/dashboard')).toBe('/dashboard');
  });

  it('should return pathname for same-origin URL', async () => {
    const { getSafeRedirectUrl } = await import('../../utils/redirect');
    const result = getSafeRedirectUrl('http://localhost:5173/venues/123');
    expect(result).toBe('/venues/123');
  });

  it('should return pathname with search params for same-origin URL', async () => {
    const { getSafeRedirectUrl } = await import('../../utils/redirect');
    const result = getSafeRedirectUrl('http://localhost:5173/search?q=hall');
    expect(result).toBe('/search?q=hall');
  });

  it('should return fallback for external URL', async () => {
    const { getSafeRedirectUrl } = await import('../../utils/redirect');
    expect(getSafeRedirectUrl('https://evil.com/phish')).toBe('/');
  });

  it('should treat bare string as same-origin relative URL', async () => {
    const { getSafeRedirectUrl } = await import('../../utils/redirect');
    expect(getSafeRedirectUrl('not a url')).toBe('/not%20a%20url');
  });

  it('should use custom fallback when provided', async () => {
    const { getSafeRedirectUrl } = await import('../../utils/redirect');
    expect(getSafeRedirectUrl('https://evil.com', '/safe')).toBe('/safe');
  });
});
