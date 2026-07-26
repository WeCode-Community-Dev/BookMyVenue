import { logError } from '../../utils/logger';
import type { GeoSearchResult, NominatimResponse } from './geo.types';

// Simple in-memory LRU cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class LRUCache<T> {
  private map = new Map<string, CacheEntry<T>>();
  private ttl: number; // ms
  private maxSize: number;

  constructor(ttl: number = 5 * 60 * 1000, maxSize = 100) {
    this.ttl = ttl;
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.map.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.map.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.data;
  }

  set(key: string, value: T): void {
    // Remove if exists to move to end
    if (this.map.has(key)) {
      this.map.delete(key);
    }

    // Evict oldest if at capacity
    if (this.map.size >= this.maxSize) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey) {
        this.map.delete(oldestKey);
      }
    }

    this.map.set(key, { data: value, timestamp: Date.now() });
  }

  clear(): void {
    this.map.clear();
  }
}

// Token bucket rate limiter (1 request per second)
class TokenBucket {
  private tokens = 1;
  private maxTokens = 1;
  private refillRate = 1000; // ms per token
  private lastRefillTime: number = Date.now();

  takeToken(): boolean {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefillTime;
    const tokensToAdd = timePassed / this.refillRate;

    if (tokensToAdd >= 1) {
      this.tokens = Math.min(this.maxTokens, this.tokens + Math.floor(tokensToAdd));
      this.lastRefillTime = now;
    }
  }
}

// Global cache and rate limiter
const nominatimCache = new LRUCache<GeoSearchResult[]>(5 * 60 * 1000, 100); // 5 min TTL
const tokenBucket = new TokenBucket();

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'BookMyVenue/1.0 (+https://github.com/ashishshaiju/bookmyvenue)';

const KERALA_VIEWBOX = '74.8,12.9,77.5,7.9';
const RESULT_LIMIT = 5;
const RAW_RESULT_LIMIT = 12;

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function scopeQueryToKerala(query: string): string {
  return normalizeQuery(query).includes('kerala') ? query : `${query}, Kerala, India`;
}

function parseNominatimResult(item: NominatimResponse): GeoSearchResult {
  const { address } = item;
  const city = address.city ?? address.town ?? address.village;
  const district = address.state_district ?? address.county;
  const postcode = address.postcode;

  return {
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    ...(city && { city }),
    ...(district && { district }),
    ...(postcode && { postcode }),
    boundingbox: [
      parseFloat(item.boundingbox[0]),
      parseFloat(item.boundingbox[1]),
      parseFloat(item.boundingbox[2]),
      parseFloat(item.boundingbox[3]),
    ],
  };
}

export async function searchPlace(query: string): Promise<GeoSearchResult[]> {
  const normalizedQuery = normalizeQuery(query);

  // Check cache first
  const cached = nominatimCache.get(normalizedQuery);
  if (cached) {
    return cached;
  }

  // Rate limit
  if (!tokenBucket.takeToken()) {
    logError('Nominatim rate limit reached', { module: 'geo.service.ts/searchPlace' });
    throw new Error('Search temporarily unavailable — please try again');
  }

  try {
    const url = new URL(NOMINATIM_BASE_URL);
    url.searchParams.set('q', scopeQueryToKerala(query));
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('countrycodes', 'in');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', String(RAW_RESULT_LIMIT));
    url.searchParams.set('viewbox', KERALA_VIEWBOX);
    url.searchParams.set('bounded', '1');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim returned ${String(response.status)}`);
    }

    const data = (await response.json()) as NominatimResponse[];
    const results = data
      .filter((item) => (item.address.state ?? '').toLowerCase() === 'kerala')
      .slice(0, RESULT_LIMIT)
      .map(parseNominatimResult);

    // Cache the results
    nominatimCache.set(normalizedQuery, results);

    return results;
  } catch (err) {
    const error = err as Error;
    logError('Nominatim search failed', {
      module: 'geo.service.ts/searchPlace',
      error: error.message,
      query,
    });
    throw new Error('Search temporarily unavailable — please try again', { cause: err });
  }
}
