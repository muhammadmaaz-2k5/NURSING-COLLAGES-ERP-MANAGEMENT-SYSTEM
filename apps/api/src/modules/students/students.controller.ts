import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { StudentStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Students Management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @RequirePermissions('student.read')
  @ApiOperation({ summary: 'List all enrolled students with academic counts' })
  @ApiQuery({ name: 'status', enum: StudentStatus, required: false })
  @ApiQuery({ name: 'programId', required: false })
  findAll(@Query('status') status?: StudentStatus, @Query('programId') programId?: string) {
    return this.studentsService.findAll(status, programId);
  }

  @Get('metrics')
  @RequirePermissions('student.read')
  @ApiOperation({ summary: 'Get summary metrics of student enrollments' })
  getMetrics() {
    return this.studentsService.getMetrics();
  }

  @Get(':id')
  @RequirePermissions('student.read')
  @ApiOperation({ summary: 'Get comprehensive student profile by ID or Student Registration No' })
  @ApiParam({ name: 'id', description: 'Student UUID or student registration roll number' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }
}
