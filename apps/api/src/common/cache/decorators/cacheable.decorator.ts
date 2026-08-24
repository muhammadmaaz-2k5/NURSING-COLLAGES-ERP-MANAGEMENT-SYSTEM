import { CacheableOptions } from '../cache.interfaces';
import { CacheService } from '../cache.service';
import { CACHEABLE_METADATA } from '../cache.constants';

/**
 * Method decorator that caches the result of an asynchronous method.
 *
 * @example
 * ```ts
 * @Cacheable({
 *   key: (args) => `programs:${args[0] || 'all'}`,
 *   ttl: 300,
 *   tags: ['academic', 'programs'],
 * })
 * async getPrograms(deptId?: string) { ... }
 * ```
 */
export function Cacheable(options: CacheableOptions): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(CACHEABLE_METADATA, options, descriptor.value);
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = CacheService.getInstance();
      if (!cacheService) {
        return originalMethod.apply(this, args);
      }

      // Compute cache key
      let cacheKey: string;
      if (typeof options.key === 'function') {
        cacheKey = options.key(args);
      } else {
        cacheKey = options.key;
      }

      // Compute tags
      let tags: string[] = [];
      if (typeof options.tags === 'function') {
        tags = options.tags(args);
      } else if (Array.isArray(options.tags)) {
        tags = options.tags;
      }

      // Use getOrSet for cache-aside with mutex protection
      return cacheService.getOrSet(
        cacheKey,
        async () => {
          const result = await originalMethod.apply(this, args);
          if (options.condition && !options.condition(result, args)) {
            return result;
          }
          return result;
        },
        options.ttl,
        tags,
      );
    };

    return descriptor;
  };
}
