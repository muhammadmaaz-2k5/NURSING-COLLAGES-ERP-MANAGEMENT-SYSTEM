import { Injectable, Logger } from '@nestjs/common';
import { CacheStore } from '../cache.interfaces';

interface MemoryCacheEntry {
  value: string;
  expiresAt: number | null;
  tags: Set<string>;
}

@Injectable()
export class MemoryCacheStore implements CacheStore {
  private readonly logger = new Logger(MemoryCacheStore.name);
  private readonly store = new Map<string, MemoryCacheEntry>();
  private readonly tagMap = new Map<string, Set<string>>(); // tag -> Set of keys
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically evict expired items
    this.cleanupTimer = setInterval(() => this.purgeExpired(), 60000);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
    this.logger.log('🧠 In-Memory Cache Store initialized (Active fallback)');
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.del(key);
      return null;
    }

    try {
      return JSON.parse(entry.value) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number, tags: string[] = []): Promise<void> {
    const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    const serialized = JSON.stringify(value);
    const tagSet = new Set(tags);

    this.store.set(key, {
      value: serialized,
      expiresAt,
      tags: tagSet,
    });

    for (const tag of tags) {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set());
      }
      this.tagMap.get(tag)!.add(key);
    }
  }

  async del(key: string): Promise<void> {
    const entry = this.store.get(key);
    if (entry) {
      for (const tag of entry.tags) {
        this.tagMap.get(tag)?.delete(key);
      }
      this.store.delete(key);
    }
  }

  async delMany(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.del(key);
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    const keys = this.tagMap.get(tag);
    if (keys && keys.size > 0) {
      for (const key of Array.from(keys)) {
        this.store.delete(key);
      }
      this.tagMap.delete(tag);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of Array.from(this.store.keys())) {
      if (regexPattern.test(key)) {
        await this.del(key);
      }
    }
  }

  async flush(): Promise<void> {
    this.store.clear();
    this.tagMap.clear();
  }

  isAvailable(): boolean {
    return true;
  }

  getStoreType(): 'memory' {
    return 'memory';
  }

  private purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        this.del(key);
      }
    }
  }
}
