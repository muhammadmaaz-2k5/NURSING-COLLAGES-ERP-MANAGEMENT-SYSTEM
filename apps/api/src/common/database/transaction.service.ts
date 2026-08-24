import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface TransactionOptions {
  maxWait?: number;
  timeout?: number;
  isolationLevel?: Prisma.TransactionIsolationLevel;
  retries?: number;
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Execute an atomic callback within a Prisma interactive transaction.
   * Includes automatic retry on transient deadlocks or concurrency conflicts.
   */
  async run<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    options: TransactionOptions = {},
  ): Promise<T> {
    const retries = options.retries ?? 3;
    let attempt = 0;

    while (attempt < retries) {
      attempt++;
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            return await fn(tx);
          },
          {
            maxWait: options.maxWait ?? 5000,
            timeout: options.timeout ?? 15000,
            isolationLevel: options.isolationLevel,
          },
        );
      } catch (error: any) {
        const isDeadlock = error?.code === 'P2034' || error?.message?.includes('deadlock');

        if (isDeadlock && attempt < retries) {
          const backoffMs = Math.min(100 * Math.pow(2, attempt), 1000);
          this.logger.warn(
            `Transaction deadlock detected (Attempt ${attempt}/${retries}). Retrying in ${backoffMs}ms...`,
          );
          await new Promise((res) => setTimeout(res, backoffMs));
          continue;
        }

        this.logger.error(`Transaction aborted: ${error?.message}`);
        throw error;
      }
    }

    throw new Error('Transaction failed after maximum retry attempts');
  }

  /**
   * Semantic alias for run()
   */
  async executeWithTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    options: TransactionOptions = {},
  ): Promise<T> {
    return this.run(fn, options);
  }
}

