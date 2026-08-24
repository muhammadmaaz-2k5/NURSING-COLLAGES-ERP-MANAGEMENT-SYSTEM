import { SetMetadata } from '@nestjs/common';
import { HTTP_CACHE_METADATA } from '../cache.constants';
import { HttpCacheOptions } from '../cache.interfaces';

/**
 * Controller endpoint decorator to cache HTTP responses.
 *
 * @example
 * ```ts
 * @Get('programs')
 * @HttpCache({ ttl: 60 })
 * async getPrograms() { ... }
 * ```
 */
export const HttpCache = (options: HttpCacheOptions = {}) =>
  SetMetadata(HTTP_CACHE_METADATA, options);
