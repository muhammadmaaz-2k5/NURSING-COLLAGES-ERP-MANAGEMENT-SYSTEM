export const CACHE_STORE_TOKEN = Symbol('CACHE_STORE_TOKEN');
export const CACHE_MODULE_OPTIONS = Symbol('CACHE_MODULE_OPTIONS');

export const CACHEABLE_METADATA = 'CACHEABLE_METADATA';
export const CACHE_EVICT_METADATA = 'CACHE_EVICT_METADATA';
export const HTTP_CACHE_METADATA = 'HTTP_CACHE_METADATA';

export const DEFAULT_CACHE_TTL = 300; // 5 minutes
export const DEFAULT_KEY_PREFIX = 'pern:erp:';

/**
 * Standard TTL Presets (in seconds)
 */
export const TTL_PRESETS = {
  INSTANT: 10,       // 10s
  SHORT: 60,         // 1m
  MEDIUM: 300,       // 5m
  LONG: 1800,        // 30m
  DAY: 86400,        // 24h
  WEEK: 604800,      // 7d
} as const;
