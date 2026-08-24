import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { AUDITED_METADATA, AuditOptions } from './audit.decorator';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.getAllAndOverride<AuditOptions>(
      AUDITED_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!auditOptions) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    const correlationId = req.headers[CORRELATION_ID_HEADER];
    const args = req.body ? [req.body] : [];

    return next.handle().pipe(
      tap({
        next: async (result) => {
          const entityId = auditOptions.getEntityId
            ? auditOptions.getEntityId(args, result)
            : result?.id || req.params?.id;

          await this.auditService.log({
            userId: user?.id,
            action: auditOptions.action,
            entity: auditOptions.entity,
            entityId,
            newData: auditOptions.captureDiff !== false ? result : undefined,
            ipAddress: typeof ipAddress === 'string' ? ipAddress : ipAddress?.[0],
            userAgent,
            correlationId,
          });
        },
      }),
    );
  }
}
