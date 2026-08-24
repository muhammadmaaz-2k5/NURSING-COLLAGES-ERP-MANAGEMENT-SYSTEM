import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { Idempotent } from '../../common/database/idempotency.decorator';
import { AttendanceStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MarkStudentRecordDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ example: 'On-time bedside ward rounds', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

class MarkBatchAttendanceRequestDto {
  @ApiProperty({ example: 'class-cuid-123' })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({ example: 'subject-cuid-123' })
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiProperty({ example: '2026-08-24' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ type: [MarkStudentRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarkStudentRecordDto)
  records: MarkStudentRecordDto[];
}

class MarkFacultyAttendanceDto {
  @ApiProperty({ example: 'faculty-cuid-123' })
  @IsNotEmpty()
  @IsString()
  facultyId: string;

  @ApiProperty({ example: '2026-08-24' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ example: 'Biometric biometric match', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

@ApiTags('Attendance Tracking')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('students/batch')
  @RequirePermissions('attendance.create')
  @Idempotent({ ttlSeconds: 120 })
  @Audited({ entity: 'StudentAttendance', action: 'CREATE' })
  @ApiOperation({ summary: 'Batch mark student class attendance with idempotency protection' })
  markStudentBatch(@Body() dto: MarkBatchAttendanceRequestDto) {
    return this.attendanceService.markStudentBatch(dto);
  }

  @Get('classes/:classId/subjects/:subjectId')
  @RequirePermissions('attendance.read')
  @ApiOperation({ summary: 'Get class attendance sheet & marking roster for a specific date' })
  @ApiParam({ name: 'classId', description: 'Class section UUID' })
  @ApiParam({ name: 'subjectId', description: 'Subject UUID' })
  @ApiQuery({ name: 'date', example: '2026-08-24' })
  getClassSheet(
    @Param('classId') classId: string,
    @Param('subjectId') subjectId: string,
    @Query('date') date: string,
  ) {
    return this.attendanceService.getClassAttendanceSheet(classId, subjectId, date);
  }

  @Get('students/:studentId/report')
  @RequirePermissions('attendance.read')
  @ApiOperation({ summary: 'Get individual student attendance percentage and exam eligibility (75% threshold)' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiQuery({ name: 'subjectId', required: false })
  getStudentReport(
    @Param('studentId') studentId: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.attendanceService.getStudentAttendanceSummary(studentId, subjectId);
  }

  @Post('faculty')
  @RequirePermissions('attendance.create')
  @Audited({ entity: 'FacultyAttendance', action: 'CREATE' })
  @ApiOperation({ summary: 'Mark faculty attendance log' })
  markFaculty(@Body() dto: MarkFacultyAttendanceDto) {
    return this.attendanceService.markFacultyAttendance(dto.facultyId, dto.date, dto.status, dto.remarks);
  }
}
