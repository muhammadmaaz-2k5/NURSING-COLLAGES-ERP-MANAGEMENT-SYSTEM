import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Health & Status')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Check API and Database Health Status' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check() {
    let dbStatus = 'disconnected';
    let collegeCount = 0;
    try {
      collegeCount = await this.prisma.college.count();
      dbStatus = 'connected';
    } catch {
      dbStatus = 'unavailable';
    }

    return {
      status: 'ok',
      service: 'PERN Multi-College Monolith API',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        collegesRegistered: collegeCount,
      },
    };
  }
}
