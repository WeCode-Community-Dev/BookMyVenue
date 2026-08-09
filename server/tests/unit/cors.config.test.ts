import { describe, it, expect, afterEach, vi } from 'vitest';
import { parseCommaSeparatedValues } from '../../src/utils/envUtils';
import { corsConfig } from '../../src/constants/env';

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
