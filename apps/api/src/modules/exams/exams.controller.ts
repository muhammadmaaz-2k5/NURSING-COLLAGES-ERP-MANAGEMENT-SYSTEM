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
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { ExamType, ExamStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateExamRequestDto {
  @ApiProperty({ example: 'semester-cuid-123' })
  @IsNotEmpty()
  @IsString()
  semesterId: string;

  @ApiProperty({ example: 'subject-cuid-123' })
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiProperty({ example: 'faculty-cuid-123', required: false })
  @IsOptional()
  @IsString()
  facultyId?: string;

  @ApiProperty({ example: 'Final Examination Spring 2026' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ExamType, example: ExamType.FINAL })
  @IsEnum(ExamType)
  type: ExamType;

  @ApiProperty({ example: 100 })
  @IsNumber()
  totalMarks: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  passingMarks: number;

  @ApiProperty({ example: '2026-08-28', required: false })
  @IsOptional()
  @IsDateString()
  examDate?: string;

  @ApiProperty({ example: '09:00', required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ example: '12:00', required: false })
  @IsOptional()
  @IsString()
  endTime?: string;
}

class StudentMarksItemDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 87.5 })
  @IsNumber()
  marks: number;

  @ApiProperty({ example: 'Excellent performance in theory & clinical scenarios', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

class EnterMarksRequestDto {
  @ApiProperty({ type: [StudentMarksItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentMarksItemDto)
  records: StudentMarksItemDto[];
}

@ApiTags('Examinations & Results')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @RequirePermissions('exam.create')
  @Audited({ entity: 'Exam', action: 'CREATE' })
  @ApiOperation({ summary: 'Schedule an academic or clinical examination' })
  create(@Body() dto: CreateExamRequestDto) {
    return this.examsService.createExam(dto);
  }

  @Get()
  @RequirePermissions('exam.read')
  @ApiOperation({ summary: 'List scheduled examinations' })
  @ApiQuery({ name: 'semesterId', required: false })
  @ApiQuery({ name: 'subjectId', required: false })
  @ApiQuery({ name: 'status', enum: ExamStatus, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  findAll(
    @Query('semesterId') semesterId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('status') status?: ExamStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.examsService.findExams({
      semesterId,
      subjectId,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @RequirePermissions('exam.read')
  @ApiOperation({ summary: 'Get exam details with entered marks & student roster' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Post(':id/marks')
  @RequirePermissions('exam.manage')
  @Audited({ entity: 'ExamMarks', action: 'CREATE' })
  @ApiOperation({ summary: 'Enter and auto-calculate grades & grade points for an examination' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  enterMarks(
    @Param('id') id: string,
    @Body() dto: EnterMarksRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.examsService.enterMarks({ examId: id, records: dto.records }, user.id);
  }

  @Post(':id/publish')
  @RequirePermissions('result.publish')
  @Audited({ entity: 'ExamResult', action: 'PUBLISH' })
  @ApiOperation({ summary: 'Publish exam results, lock marks, and notify students' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  publishResults(@Param('id') id: string, @CurrentUser() user: any) {
    return this.examsService.publishResults(id, user.id);
  }

  @Get('students/:studentId/transcript')
  @RequirePermissions('student.read')
  @ApiOperation({ summary: 'Generate dynamic official transcript with GPA and cumulative CGPA' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  getTranscript(@Param('studentId') studentId: string) {
    return this.examsService.getStudentTranscript(studentId);
  }
}
