import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, ip } = req;
    const correlationId = req.headers[CORRELATION_ID_HEADER] || '-';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const statusCode = res.statusCode;
          const duration = Date.now() - startTime;
          this.logger.log(
            `[${correlationId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms [${ip}]`,
          );
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          const statusCode = err?.status || 500;
          this.logger.warn(
            `[${correlationId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms - Error: ${err?.message} [${ip}]`,
          );
        },
      }),
    );
  }
}
