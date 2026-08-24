import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createPaginatedResult, PaginatedResult } from '../interfaces/pagination.interface';

export interface CreateAuditLogDto {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
}

export interface QueryAuditLogsDto {
  entity?: string;
  action?: string;
  userId?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Record a business or security audit event asynchronously
   */
  async log(dto: CreateAuditLogDto): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: dto.userId,
          action: dto.action.toUpperCase(),
          entity: dto.entity,
          entityId: dto.entityId,
          oldData: dto.oldData ? JSON.parse(JSON.stringify(dto.oldData)) : undefined,
          newData: dto.newData ? JSON.parse(JSON.stringify(dto.newData)) : undefined,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
        },
      });

      this.logger.debug(
        `[AUDIT] User:${dto.userId || 'SYSTEM'} ${dto.action} ${dto.entity}:${dto.entityId || '-'}`,
      );
    } catch (err: any) {
      // Never crash the primary request if audit write encounters a DB issue
      this.logger.error(`Failed to record audit log: ${err?.message}`, err?.stack);
    }
  }

  /**
   * Query filtered and paginated business audit logs
   */
  async getAuditLogs(query: QueryAuditLogsDto): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.entity) where.entity = { equals: query.entity, mode: 'insensitive' };
    if (query.action) where.action = { equals: query.action.toUpperCase() };
    if (query.userId) where.userId = query.userId;
    if (query.entityId) where.entityId = query.entityId;

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [total, data] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }
}
