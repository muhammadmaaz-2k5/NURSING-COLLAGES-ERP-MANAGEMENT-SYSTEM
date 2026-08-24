import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId = (request.headers[CORRELATION_ID_HEADER] as string) || '-';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error occurred';
    let errorType = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        message = (res as any).message || res;
        errorType = (res as any).error || exception.name;
      } else {
        message = res;
        errorType = exception.name;
      }
    } else if (this.isPrismaError(exception)) {
      const prismaHandled = this.handlePrismaError(exception);
      status = prismaHandled.status;
      message = prismaHandled.message;
      errorType = prismaHandled.error;
    } else if (exception instanceof Error) {
      message = exception.message;
      errorType = exception.name;
      this.logger.error(`[${correlationId}] Unhandled Exception: ${exception.message}`, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      error: errorType,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId,
    });
  }

  private isPrismaError(error: any): boolean {
    return error?.code && typeof error.code === 'string' && error.code.startsWith('P');
  }

  private handlePrismaError(error: any): { status: number; message: string; error: string } {
    switch (error.code) {
      case 'P2002': {
        const target = (error.meta?.target as string[]) || 'unique field';
        return {
          status: HttpStatus.CONFLICT,
          message: `A record with this ${Array.isArray(target) ? target.join(', ') : target} already exists.`,
          error: 'ConflictException (DuplicateKey)',
        };
      }
      case 'P2025': {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'The requested record was not found or has already been deleted.',
          error: 'NotFoundException',
        };
      }
      case 'P2003': {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Foreign key constraint failed. Related record does not exist.',
          error: 'ForeignKeyViolationException',
        };
      }
      default:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Database constraint error: ${error.message}`,
          error: 'DatabaseException',
        };
    }
  }
}
