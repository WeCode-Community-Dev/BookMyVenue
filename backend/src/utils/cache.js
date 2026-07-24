import { redisClient } from "../config/redis.js";

const ACTIVE_VENUES_CACHE_KEY = "venues:active:all";
const ACTIVE_VENUES_CACHE_TTL = 300; // 5 minutes
const VENUE_AVAILABILITY_CACHE_TTL = 60; // 1 minute

const getActiveVenueCacheKey = (venueId) => `venues:active:${venueId}`;
const getVenueAvailabilityCacheKey = (venueId) =>
  `availability:venue:${venueId}`;

const isRedisReady = () => Boolean(redisClient?.isOpen);

const getCache = async (key) => {
  try {
    if (!isRedisReady()) {
      return null;
    }

    const cached = await redisClient.get(key);
    if (!cached) {
      return null;
    }

    return JSON.parse(cached);
  } catch (error) {
    console.error("Redis getCache error:", error);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds) => {
  try {
    if (!isRedisReady()) {
      return;
    }

    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    console.error("Redis setCache error:", error);
  }
};

const delCache = async (key) => {
  try {
    if (!isRedisReady()) {
      return;
    }

    await redisClient.del(key);
  } catch (error) {
    console.error("Redis delCache error:", error);
  }
};

const invalidateActiveVenuesCache = async () => {
  await delCache(ACTIVE_VENUES_CACHE_KEY);
};

const invalidateActiveVenueCache = async (venueId) => {
  await delCache(getActiveVenueCacheKey(venueId));
};

const invalidateVenueAvailabilityCache = async (venueId) => {
  await delCache(getVenueAvailabilityCacheKey(venueId));
};

export {
  getCache, setCache, delCache, getActiveVenueCacheKey, getVenueAvailabilityCacheKey,
  invalidateActiveVenuesCache, invalidateActiveVenueCache, invalidateVenueAvailabilityCache,
  ACTIVE_VENUES_CACHE_KEY, ACTIVE_VENUES_CACHE_TTL, VENUE_AVAILABILITY_CACHE_TTL,
};
