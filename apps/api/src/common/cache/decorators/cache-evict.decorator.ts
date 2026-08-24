import { CacheEvictOptions } from '../cache.interfaces';
import { CacheService } from '../cache.service';
import { CACHE_EVICT_METADATA } from '../cache.constants';

/**
 * Method decorator that invalidates cache entries when a mutation occurs.
 *
 * @example
 * ```ts
 * @CacheEvict({
 *   tags: ['academic'],
 *   pattern: 'departments:*',
 *   keys: ['academic:overview'],
 * })
 * async createProgram(dto: CreateProgramDto) { ... }
 * ```
 */
export function CacheEvict(options: CacheEvictOptions): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(CACHE_EVICT_METADATA, options, descriptor.value);
    const originalMethod = descriptor.value;
    const when = options.when || 'after';

    descriptor.value = async function (...args: any[]) {
      const cacheService = CacheService.getInstance();

      const performEviction = async (result?: any) => {
        if (!cacheService) return;

        // 1. Evict specific keys
        if (options.keys) {
          const keysToEvict =
            typeof options.keys === 'function'
              ? options.keys(args, result)
              : options.keys;
          if (keysToEvict.length > 0) {
            await cacheService.delMany(keysToEvict);
          }
        }

        // 2. Evict by tags
        if (options.tags) {
          const tagsToEvict =
            typeof options.tags === 'function'
              ? options.tags(args, result)
              : options.tags;
          if (tagsToEvict.length > 0) {
            await cacheService.evictByTags(tagsToEvict);
          }
        }

        // 3. Evict by pattern
        if (options.pattern) {
          const patternToEvict =
            typeof options.pattern === 'function'
              ? options.pattern(args, result)
              : options.pattern;
          if (patternToEvict) {
            await cacheService.evictPattern(patternToEvict);
          }
        }
      };

      if (when === 'before') {
        await performEviction();
      }

      const result = await originalMethod.apply(this, args);

      if (when === 'after') {
        await performEviction(result);
      }

      return result;
    };

    return descriptor;
  };
}
