import { Injectable, Inject, Logger, Optional } from '@nestjs/common';
import { CacheStore, CacheModuleOptions } from './cache.interfaces';
import { CACHE_STORE_TOKEN, CACHE_MODULE_OPTIONS, DEFAULT_CACHE_TTL } from './cache.constants';
import { MemoryCacheStore } from './stores/memory-cache.store';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private static instance: CacheService | null = null;
  private readonly inFlightPromises = new Map<string, Promise<any>>();
  private readonly memoryFallback = new MemoryCacheStore();

  constructor(
    @Optional() @Inject(CACHE_STORE_TOKEN) private readonly store?: CacheStore,
    @Optional() @Inject(CACHE_MODULE_OPTIONS) private readonly options?: CacheModuleOptions,
  ) {
    CacheService.instance = this;
  }

  /**
   * Static access for method decorators
   */
  public static getInstance(): CacheService | null {
    return CacheService.instance;
  }

  private getActiveStore(): CacheStore {
    if (this.store && this.store.isAvailable()) {
      return this.store;
    }
    return this.memoryFallback;
  }

  /**
   * Retrieve a typed value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.getActiveStore().get<T>(key);
    } catch (err: any) {
      this.logger.warn(`Cache get failed for key "${key}": ${err?.message}`);
      return null;
    }
  }

  /**
   * Store a value in cache with optional TTL (seconds) and tags
   */
  async set<T>(key: string, value: T, ttlSeconds?: number, tags: string[] = []): Promise<void> {
    const ttl = ttlSeconds ?? this.options?.defaultTtlSeconds ?? DEFAULT_CACHE_TTL;
    try {
      await this.getActiveStore().set<T>(key, value, ttl, tags);
    } catch (err: any) {
      this.logger.warn(`Cache set failed for key "${key}": ${err?.message}`);
    }
  }

  /**
   * Delete a key from cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.getActiveStore().del(key);
      await this.memoryFallback.del(key);
    } catch (err: any) {
      this.logger.warn(`Cache del failed for key "${key}": ${err?.message}`);
    }
  }

  /**
   * Delete multiple keys from cache
   */
  async delMany(keys: string[]): Promise<void> {
    if (!keys || keys.length === 0) return;
    try {
      await this.getActiveStore().delMany(keys);
      await this.memoryFallback.delMany(keys);
    } catch (err: any) {
      this.logger.warn(`Cache delMany failed: ${err?.message}`);
    }
  }

  /**
   * Invalidate all cached entries associated with a specific tag
   */
  async evictByTag(tag: string): Promise<void> {
    try {
      await this.getActiveStore().invalidateByTag(tag);
      await this.memoryFallback.invalidateByTag(tag);
      this.logger.debug(`Evicted cache for tag "${tag}"`);
    } catch (err: any) {
      this.logger.warn(`Cache evictByTag failed for tag "${tag}": ${err?.message}`);
    }
  }

  /**
   * Invalidate all cached entries associated with multiple tags
   */
  async evictByTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.evictByTag(tag);
    }
  }

  /**
   * Invalidate keys matching a pattern (e.g. "academic:*")
   */
  async evictPattern(pattern: string): Promise<void> {
    try {
      await this.getActiveStore().invalidatePattern(pattern);
      await this.memoryFallback.invalidatePattern(pattern);
      this.logger.debug(`Evicted cache matching pattern "${pattern}"`);
    } catch (err: any) {
      this.logger.warn(`Cache evictPattern failed for pattern "${pattern}": ${err?.message}`);
    }
  }

  /**
   * Cache-Aside pattern with Thundering Herd (Mutex) protection.
   * If cache miss occurs, only 1 invocation of `factory` executes concurrently for this key.
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds?: number,
    tags: string[] = [],
  ): Promise<T> {
    // 1. Try to read from cache
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    // 2. Check if a fetch is already in flight for this key (Thundering Herd protection)
    if (this.inFlightPromises.has(key)) {
      return this.inFlightPromises.get(key);
    }

    // 3. Execute factory and cache result
    const fetchPromise = (async () => {
      try {
        const result = await factory();
        if (result !== null && result !== undefined) {
          await this.set<T>(key, result, ttlSeconds, tags);
        }
        return result;
      } finally {
        this.inFlightPromises.delete(key);
      }
    })();

    this.inFlightPromises.set(key, fetchPromise);
    return fetchPromise;
  }

  /**
   * Flush all cache entries
   */
  async flush(): Promise<void> {
    try {
      await this.getActiveStore().flush();
      await this.memoryFallback.flush();
      this.logger.log('Cache flushed successfully');
    } catch (err: any) {
      this.logger.warn(`Cache flush failed: ${err?.message}`);
    }
  }

  /**
   * Get active store driver name
   */
  getStoreType(): 'redis' | 'memory' {
    return this.getActiveStore().getStoreType();
  }
}
