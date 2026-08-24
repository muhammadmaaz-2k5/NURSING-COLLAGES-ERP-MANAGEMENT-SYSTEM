import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../modules/auth/guards/permissions.guard';
import { RequirePermissions } from '../../modules/auth/decorators/permissions.decorator';

@ApiTags('Business Audit Logging Trail')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermissions('system.settings.manage')
  @ApiOperation({ summary: 'Query and filter immutable business audit logs' })
  @ApiQuery({ name: 'entity', required: false, example: 'Student' })
  @ApiQuery({ name: 'action', required: false, example: 'UPDATE' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-08-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-08-31' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getLogs(
    @Query('entity') entity?: string,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
    @Query('entityId') entityId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.getAuditLogs({
      entity,
      action,
      userId,
      entityId,
      startDate,
      endDate,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
