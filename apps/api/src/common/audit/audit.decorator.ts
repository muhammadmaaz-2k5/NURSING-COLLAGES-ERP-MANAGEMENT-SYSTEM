import { SetMetadata } from '@nestjs/common';

export const AUDITED_METADATA = 'AUDITED_METADATA';

export interface AuditOptions {
  entity: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'APPROVE' | 'REVOKE';
  getEntityId?: (args: any[], result?: any) => string | undefined;
  captureDiff?: boolean;
}

/**
 * Declarative decorator for auditing sensitive business operations
 *
 * @example
 * ```ts
 * @Audited({ entity: 'Student', action: 'CREATE', getEntityId: (_, res) => res?.id })
 * async createStudent(...) { ... }
 * ```
 */
export const Audited = (options: AuditOptions) => SetMetadata(AUDITED_METADATA, options);
