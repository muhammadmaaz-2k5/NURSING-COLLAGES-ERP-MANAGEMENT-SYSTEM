import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AdmissionsService } from './admissions.service';
import { AdmissionStatus } from '@prisma/client';

@ApiTags('Admissions & Applications')
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all admission applications' })
  @ApiQuery({ name: 'status', enum: AdmissionStatus, required: false })
  @ApiResponse({ status: 200, description: 'Admission applications list' })
  getApplications(@Query('status') status?: AdmissionStatus) {
    return this.admissionsService.getApplications(status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get admission application summary statistics' })
  @ApiResponse({ status: 200, description: 'Admission metrics' })
  getStats() {
    return this.admissionsService.getStats();
  }
}
