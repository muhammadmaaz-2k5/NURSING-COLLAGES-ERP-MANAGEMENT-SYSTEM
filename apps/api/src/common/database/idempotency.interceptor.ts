import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../cache';
import { IDEMPOTENT_METADATA, IdempotentOptions } from './idempotency.decorator';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: CacheService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const options = this.reflector.getAllAndOverride<IdempotentOptions>(
      IDEMPOTENT_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const headerName = options.headerKey || 'idempotency-key';
    const idempotencyKey = req.headers[headerName.toLowerCase()];

    if (!idempotencyKey) {
      return next.handle(); // No idempotency key supplied, proceed normally
    }

    const cacheKey = `idempotency:${idempotencyKey}`;
    const ttl = options.ttlSeconds || 600; // 10 minutes

    const existing = await this.cacheService.get<{ status: 'IN_PROGRESS' | 'COMPLETED'; result?: any }>(cacheKey);

    if (existing) {
      if (existing.status === 'IN_PROGRESS') {
        throw new ConflictException('Concurrent request in progress for this Idempotency-Key. Please retry shortly.');
      }
      // Return previous cached result directly
      const res = context.switchToHttp().getResponse();
      res.setHeader('X-Idempotency-Replay', 'true');
      return of(existing.result);
    }

    // Set in-progress lock
    await this.cacheService.set(cacheKey, { status: 'IN_PROGRESS' }, 60);

    return next.handle().pipe(
      tap({
        next: async (result) => {
          await this.cacheService.set(
            cacheKey,
            { status: 'COMPLETED', result },
            ttl,
          );
        },
        error: async () => {
          // Invalidate on error so client can safely retry
          await this.cacheService.del(cacheKey);
        },
      }),
    );
  }
}
