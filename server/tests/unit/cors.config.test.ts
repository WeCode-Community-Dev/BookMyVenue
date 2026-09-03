import { describe, it, expect, afterEach, vi } from 'vitest';
import { parseCommaSeparatedValues } from '../../src/utils/envUtils';
import { corsConfig } from '../../src/constants/env';
import { mergeAllowedHeaders } from '../../src/configs/cors.config';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('parseCommaSeparatedValues', () => {
  it('returns an empty array when value is undefined', () => {
    expect(parseCommaSeparatedValues(undefined)).toEqual([]);
  });

  it('returns an empty array when value is empty string', () => {
    expect(parseCommaSeparatedValues('')).toEqual([]);
  });

  it('splits comma-separated values and trims whitespace', () => {
    expect(parseCommaSeparatedValues(' https://a.com , http://localhost:5173, b.com ')).toEqual([
      'https://a.com',
      'http://localhost:5173',
      'b.com',
    ]);
  });

  it('filters out empty entries', () => {
    expect(parseCommaSeparatedValues('a,, ,b')).toEqual(['a', 'b']);
  });
});

describe('corsConfig', () => {
  it('reads allowedOrigins from ALLOWED_ORIGINS env', () => {
    vi.stubEnv('ALLOWED_ORIGINS', 'https://bookmyvenue.com,http://localhost:5173');

    expect(corsConfig.allowedOrigins).toEqual([
      'https://bookmyvenue.com',
      'http://localhost:5173',
    ]);
  });

  it('returns empty array when ALLOWED_ORIGINS is missing', () => {
    expect(corsConfig.allowedOrigins).toEqual([]);
  });

  it('reads allowedHeaders from ALLOWED_HEADERS env', () => {
    vi.stubEnv('ALLOWED_HEADERS', 'Content-Type,Authorization');

    expect(corsConfig.allowedHeaders).toEqual(['Content-Type', 'Authorization']);
  });

  it('returns empty array when ALLOWED_HEADERS is missing', () => {
    expect(corsConfig.allowedHeaders).toEqual([]);
  });
});

describe('mergeAllowedHeaders', () => {
  it('always includes the base standard headers', () => {
    expect(mergeAllowedHeaders([])).toEqual([
      'Content-Type',
      'Authorization',
      'Accept',
      'Accept-Language',
      'X-Requested-With',
    ]);
  });

  it('merges custom headers after the base headers', () => {
    const merged = mergeAllowedHeaders(['x-session-token', 'Idempotency-Key']);

    expect(merged).toContain('Content-Type');
    expect(merged).toContain('Authorization');
    expect(merged).toContain('x-session-token');
    expect(merged).toContain('Idempotency-Key');
  });

  it('dedupes headers that appear in both base and custom lists', () => {
    const merged = mergeAllowedHeaders(['Content-Type']);
    expect(merged.filter((h) => h === 'Content-Type')).toHaveLength(1);
  });

  it('keeps the merged list stable for the expected custom headers', () => {
    const merged = mergeAllowedHeaders([
      'x-session-token',
      'skip_zrok_interstitial',
      'Idempotency-Key',
    ]);

    expect(merged).toEqual([
      'Content-Type',
      'Authorization',
      'Accept',
      'Accept-Language',
      'X-Requested-With',
      'x-session-token',
      'skip_zrok_interstitial',
      'Idempotency-Key',
    ]);
  });
});
