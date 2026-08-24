import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiProperty } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AttendanceStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MarkAttendanceItemDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'subject-cuid-123' })
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiProperty({ example: 'class-cuid-123' })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({ example: '2026-08-24' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ example: 'On time', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

class BulkMarkAttendanceDto {
  @ApiProperty({ type: [MarkAttendanceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarkAttendanceItemDto)
  records: MarkAttendanceItemDto[];
}

@ApiTags('Attendance Management')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get attendance history for a student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiQuery({ name: 'subjectId', required: false })
  getStudentAttendance(
    @Param('studentId') studentId: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.attendanceService.getStudentAttendance(studentId, subjectId);
  }

  @Get('class')
  @ApiOperation({ summary: 'Get daily attendance sheet for a class section and subject' })
  @ApiQuery({ name: 'classId', required: true })
  @ApiQuery({ name: 'subjectId', required: true })
  @ApiQuery({ name: 'date', required: true, example: '2026-08-24' })
  getClassAttendance(
    @Query('classId') classId: string,
    @Query('subjectId') subjectId: string,
    @Query('date') date: string,
  ) {
    return this.attendanceService.getClassAttendance(classId, subjectId, date);
  }

  @Post('mark')
  @ApiOperation({ summary: 'Record or update student attendance in batch' })
  markAttendance(@Body() dto: BulkMarkAttendanceDto) {
    return this.attendanceService.markStudentAttendance(dto.records);
  }
}
