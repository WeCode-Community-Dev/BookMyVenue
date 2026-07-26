import type { IPermission } from '../../constants/permissions';
import { fetchRolePermissions } from '../roles.service';
import { logInfo } from '../../utils/logger';

interface CacheEntry {
  permissions: string[];
  roleName: string;
  timestamp: number;
}

export interface CacheStatEntry {
  roleId: string;
  roleName: string;
  permissionCount: number;
  ageSeconds: number;
}

const store = new Map<string, CacheEntry>();

const TTL_MS = 15 * 60 * 1000; // 15mins (same as accessToken  TTL)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5mins

// Pure helpers
const isExpired = (entry: CacheEntry): boolean => Date.now() - entry.timestamp > TTL_MS;

const ageInSeconds = (entry: CacheEntry): number =>
  Math.round((Date.now() - entry.timestamp) / 1000);

// Internal read/write
const getEntry = (roleId: string): CacheEntry | null => {
  const entry = store.get(roleId);
  if (!entry) return null;
  if (isExpired(entry)) {
    store.delete(roleId);
    return null;
  }
  return entry;
};

const setEntry = (roleId: string, roleName: string, permissions: string[]): void => {
  store.set(roleId, { permissions, roleName, timestamp: Date.now() });
};

const resolveAndCache = async (roleId: string, roleName: string): Promise<string[]> => {
  const permissions = await fetchRolePermissions(roleId);
  setEntry(roleId, roleName, permissions);
  return permissions;
};

// Public API

/**
 * Cache-first permission lookup.
 * Cache hit → returns in-memory set (no DB).
 * Cache miss → runs $graphLookup aggregation, stores result, returns it.
 */
export const getPerms = async (roleId: string, roleName: string): Promise<IPermission[]> => {
  const cached = getEntry(roleId);
  const permissions = cached ? cached.permissions : await resolveAndCache(roleId, roleName);
  return permissions as IPermission[];
};

// Invalidate a single role's cache entry.
export const invalidateRole = (roleId: string): void => {
  const existed = store.delete(roleId);
  if (existed) {
    logInfo('Permission cache invalidated', { roleId });
  }
};

// Clear the entire cache.
// Use after bulk permission changes or schema migrations.
export const clearAll = (): void => {
  const size = store.size;
  store.clear();
  logInfo('Permission cache cleared', { removed: size });
};

export const getStats = (): { size: number; entries: CacheStatEntry[] } => {
  const entries = Array.from(store.entries()).map(([roleId, entry]) => ({
    roleId,
    roleName: entry.roleName,
    permissionCount: entry.permissions.length,
    ageSeconds: ageInSeconds(entry),
  }));
  return { size: store.size, entries };
};

// Background cleanup
const cleanupExpired = (): void => {
  let removed = 0;
  for (const [roleId, entry] of store.entries()) {
    if (isExpired(entry)) {
      store.delete(roleId);
      removed++;
    }
  }
  if (removed > 0) {
    logInfo('Permission cache cleanup', { removed });
  }
};

setInterval(cleanupExpired, CLEANUP_INTERVAL_MS).unref();
