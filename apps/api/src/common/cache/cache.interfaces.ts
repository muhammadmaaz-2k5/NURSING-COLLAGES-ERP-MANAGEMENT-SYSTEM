export interface CacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number, tags?: string[]): Promise<void>;
  del(key: string): Promise<void>;
  delMany(keys: string[]): Promise<void>;
  invalidateByTag(tag: string): Promise<void>;
  invalidatePattern(pattern: string): Promise<void>;
  flush(): Promise<void>;
  isAvailable(): boolean;
  getStoreType(): 'redis' | 'memory';
}

export interface CacheModuleOptions {
  redisUrl?: string;
  redisHost?: string;
  redisPort?: number;
  redisPassword?: string;
  redisDb?: number;
  keyPrefix?: string;
  defaultTtlSeconds?: number;
  enableMemoryFallback?: boolean;
}

export interface CacheableOptions {
  /**
   * Static key string or dynamic key resolver function based on method arguments
   */
  key: string | ((args: any[]) => string);
  /**
   * Time to live in seconds. Default is 300 (5 minutes).
   */
  ttl?: number;
  /**
   * Optional tags for group-based invalidation.
   */
  tags?: string[] | ((args: any[]) => string[]);
  /**
   * Condition whether to cache based on return value or args
   */
  condition?: (result: any, args: any[]) => boolean;
}

export interface CacheEvictOptions {
  /**
   * Specific keys to evict on method execution
   */
  keys?: string[] | ((args: any[], result?: any) => string[]);
  /**
   * Tags to invalidate (all keys tagged with this tag will be removed)
   */
  tags?: string[] | ((args: any[], result?: any) => string[]);
  /**
   * Pattern wildcard string for pattern invalidation (e.g. "academic:*")
   */
  pattern?: string | ((args: any[], result?: any) => string);
  /**
   * Whether to evict before or after method execution. Default is 'after'.
   */
  when?: 'before' | 'after';
}

export interface HttpCacheOptions {
  ttl?: number;
  keyGenerator?: (req: any) => string;
}
