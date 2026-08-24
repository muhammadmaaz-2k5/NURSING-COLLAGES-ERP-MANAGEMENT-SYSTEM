import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheStore, CacheModuleOptions } from '../cache.interfaces';
import { DEFAULT_KEY_PREFIX } from '../cache.constants';

@Injectable()
export class RedisCacheStore implements CacheStore, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheStore.name);
  private client: Redis | null = null;
  private isConnected = false;
  private readonly prefix: string;

  constructor(private readonly options: CacheModuleOptions = {}) {
    this.prefix = options.keyPrefix || DEFAULT_KEY_PREFIX;
    this.initialize();
  }

  private hasLoggedWarning = false;

  private initialize(): void {
    try {
      const redisOptions = {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy: (times: number) => {
          if (times > 3) {
            return null; // Stop reconnecting after 3 attempts if Redis is offline
          }
          return Math.min(times * 1000, 3000);
        },
      };

      if (this.options.redisUrl) {
        this.client = new Redis(this.options.redisUrl, redisOptions);
      } else if (this.options.redisHost) {
        this.client = new Redis({
          host: this.options.redisHost,
          port: this.options.redisPort || 6379,
          password: this.options.redisPassword,
          db: this.options.redisDb || 0,
          ...redisOptions,
        });
      }

      if (this.client) {
        this.client.on('connect', () => {
          this.isConnected = true;
          this.hasLoggedWarning = false;
          this.logger.log('⚡ Redis Cache Store connected successfully');
        });

        this.client.on('error', (err) => {
          this.isConnected = false;
          if (!this.hasLoggedWarning) {
            this.hasLoggedWarning = true;
            this.logger.warn(`Redis is offline (${err.message || 'connection refused'}). Cleanly falling back to In-Memory Cache.`);
          }
        });

        this.client.connect().catch((err) => {
          this.isConnected = false;
          if (!this.hasLoggedWarning) {
            this.hasLoggedWarning = true;
            this.logger.warn(`Redis initial connect failed (${err.message || 'offline'}). Using In-Memory fallback.`);
          }
        });
      }
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`Redis initialization skipped: ${err?.message}`);
    }
  }

  private formatKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private tagKey(tag: string): string {
    return `${this.prefix}tag:${tag}`;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) return null;
    try {
      const data = await this.client.get(this.formatKey(key));
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number, tags: string[] = []): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      const formattedKey = this.formatKey(key);
      const serialized = JSON.stringify(value);
      const pipeline = this.client.pipeline();

      if (ttlSeconds && ttlSeconds > 0) {
        pipeline.set(formattedKey, serialized, 'EX', ttlSeconds);
      } else {
        pipeline.set(formattedKey, serialized);
      }

      for (const tag of tags) {
        const tagKey = this.tagKey(tag);
        pipeline.sadd(tagKey, formattedKey);
        if (ttlSeconds && ttlSeconds > 0) {
          pipeline.expire(tagKey, ttlSeconds + 60); // tag expires slightly after key
        }
      }

      await pipeline.exec();
    } catch (err: any) {
      this.logger.warn(`Redis set failed for key ${key}: ${err?.message}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.del(this.formatKey(key));
    } catch (err: any) {
      this.logger.warn(`Redis del failed for key ${key}: ${err?.message}`);
    }
  }

  async delMany(keys: string[]): Promise<void> {
    if (!this.isConnected || !this.client || keys.length === 0) return;
    try {
      const formattedKeys = keys.map((k) => this.formatKey(k));
      await this.client.del(...formattedKeys);
    } catch (err: any) {
      this.logger.warn(`Redis delMany failed: ${err?.message}`);
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      const tagKey = this.tagKey(tag);
      const keys = await this.client.smembers(tagKey);
      if (keys.length > 0) {
        const pipeline = this.client.pipeline();
        pipeline.del(...keys);
        pipeline.del(tagKey);
        await pipeline.exec();
      } else {
        await this.client.del(tagKey);
      }
    } catch (err: any) {
      this.logger.warn(`Redis invalidateByTag failed for tag ${tag}: ${err?.message}`);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      const fullPattern = this.formatKey(pattern);
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.client.scan(cursor, 'MATCH', fullPattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch (err: any) {
      this.logger.warn(`Redis invalidatePattern failed for pattern ${pattern}: ${err?.message}`);
    }
  }

  async flush(): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      await this.invalidatePattern('*');
    } catch (err: any) {
      this.logger.warn(`Redis flush failed: ${err?.message}`);
    }
  }

  isAvailable(): boolean {
    return this.isConnected;
  }

  getStoreType(): 'redis' {
    return 'redis';
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        this.client.disconnect();
      }
    }
  }
}
