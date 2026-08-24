import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../cache.service';
import { HTTP_CACHE_METADATA } from '../cache.constants';
import { HttpCacheOptions } from '../cache.interfaces';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpCacheInterceptor.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpCacheOptions = this.reflector.getAllAndOverride<HttpCacheOptions>(
      HTTP_CACHE_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!httpCacheOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = httpCacheOptions.keyGenerator
      ? httpCacheOptions.keyGenerator(request)
      : `http:${request.method}:${request.originalUrl || request.url}`;

    const cachedResponse = await this.cacheService.get(cacheKey);
    if (cachedResponse !== null && cachedResponse !== undefined) {
      const response = context.switchToHttp().getResponse();
      response.setHeader('X-Cache', 'HIT');
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap(async (responseBody) => {
        if (responseBody !== null && responseBody !== undefined) {
          await this.cacheService.set(cacheKey, responseBody, httpCacheOptions.ttl);
        }
      }),
    );
  }
}
