import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENT_METADATA = 'IDEMPOTENT_METADATA';

export interface IdempotentOptions {
  ttlSeconds?: number;
  headerKey?: string;
}

/**
 * Decorator to enforce idempotency on financial mutations (e.g. payments, refunds)
 *
 * @example
 * ```ts
 * @Idempotent({ ttlSeconds: 600 })
 * @Post('payments')
 * recordPayment(...) { ... }
 * ```
 */
export const Idempotent = (options: IdempotentOptions = {}) =>
  SetMetadata(IDEMPOTENT_METADATA, options);
