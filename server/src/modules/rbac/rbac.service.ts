import { getStats, clearAll, invalidateRole } from '../../services/cache/permission-cache.service';
import type { CacheStatEntry } from '../../services/cache/permission-cache.service';

export function getCacheStats(): { size: number; entries: CacheStatEntry[] } {
  return getStats();
}

export function clearCache(): void {
  clearAll();
}

export function invalidateRoleCache(roleId: string): void {
  invalidateRole(roleId);
}
