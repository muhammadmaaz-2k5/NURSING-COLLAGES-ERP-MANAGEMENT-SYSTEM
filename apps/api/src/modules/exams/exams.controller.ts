import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiProperty } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { ExamType } from '@prisma/client';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateExamDto {
  @ApiProperty({ example: 'semester-cuid-123' })
  @IsNotEmpty()
  @IsString()
  semesterId: string;

  @ApiProperty({ example: 'subject-cuid-123' })
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiProperty({ example: 'Midterm Examination 2026' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ExamType, example: ExamType.MIDTERM })
  @IsEnum(ExamType)
  type: ExamType;

  @ApiProperty({ example: 100 })
  @IsNumber()
  totalMarks: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  passingMarks: number;
}

class ResultEntryDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 87.5 })
  @IsNumber()
  marks: number;

  @ApiProperty({ example: 'Excellent clinical concepts', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

class RecordResultsDto {
  @ApiProperty({ type: [ResultEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultEntryDto)
  records: ResultEntryDto[];
}

@ApiTags('Examinations & Results')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  @ApiOperation({ summary: 'List scheduled exams' })
  @ApiQuery({ name: 'semesterId', required: false })
  @ApiQuery({ name: 'type', enum: ExamType, required: false })
  findAll(@Query('semesterId') semesterId?: string, @Query('type') type?: ExamType) {
    return this.examsService.findAll(semesterId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam details with full student result sheet' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Schedule a new exam' })
  create(@Body() dto: CreateExamDto) {
    return this.examsService.create(dto);
  }

  @Post(':id/results')
  @ApiOperation({ summary: 'Submit student marks for an exam (computes GPA and grades)' })
  @ApiParam({ name: 'id', description: 'Exam UUID' })
  recordResults(@Param('id') id: string, @Body() dto: RecordResultsDto) {
    return this.examsService.recordResults(id, dto.records);
  }
}
