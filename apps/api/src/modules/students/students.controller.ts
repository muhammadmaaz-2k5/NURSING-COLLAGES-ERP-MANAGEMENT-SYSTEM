import {
  Controller,
  Get,
  Post,
  Put,
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
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { StudentStatus, Gender, DocumentType } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';

class CreateStudentRequestDto {
  @ApiProperty({ example: 'student@nmc.edu.pk' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Student@123', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'Muhammad' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Maaz', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'program-cuid-123' })
  @IsNotEmpty()
  @IsString()
  programId: string;

  @ApiProperty({ example: 'campus-cuid-123', required: false })
  @IsOptional()
  @IsString()
  campusId?: string;

  @ApiProperty({ example: '2004-05-15', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: 'B+', required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({ example: '37405-9988776-1', required: false })
  @IsOptional()
  @IsString()
  cnic?: string;

  @ApiProperty({ example: '+923001122334', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'House 5, Street 10, F-8/2', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Islamabad', required: false })
  @IsOptional()
  @IsString()
  city?: string;
}

class UpdateStudentRequestDto {
  @ApiProperty({ example: 'Muhammad', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Maaz', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+923001122334', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: StudentStatus, example: StudentStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  @ApiProperty({ example: 'House 5, Street 10, F-8/2', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

class AddParentRequestDto {
  @ApiProperty({ example: 'parent@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Abdul' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Rashid', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+923009988776' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Government Officer', required: false })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ example: 'Father' })
  @IsNotEmpty()
  @IsString()
  relationship: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

class EnrollSemesterRequestDto {
  @ApiProperty({ example: 'semester-cuid-123' })
  @IsNotEmpty()
  @IsString()
  semesterId: string;

  @ApiProperty({ example: 'class-cuid-123' })
  @IsNotEmpty()
  @IsString()
  classId: string;
}

class UploadStudentDocDto {
  @ApiProperty({ enum: DocumentType, example: DocumentType.CNIC })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ example: 'student_cnic.png' })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'image/png' })
  @IsNotEmpty()
  @IsString()
  mimeType: string;

  @ApiProperty({ description: 'Base64 encoded file string' })
  @IsNotEmpty()
  @IsString()
  fileBase64: string;
}

@ApiTags('Student Lifecycle & Profiles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @RequirePermissions('student.read')
  @ApiOperation({ summary: 'List and filter student directory' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: StudentStatus, required: false })
  @ApiQuery({ name: 'programId', required: false })
  @ApiQuery({ name: 'campusId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: StudentStatus,
    @Query('programId') programId?: string,
    @Query('campusId') campusId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.studentsService.findAll({
      search,
      status,
      programId,
      campusId,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('metrics')
  @RequirePermissions('student.read')
  @ApiOperation({ summary: 'Get student enrollment and graduation metrics' })
  getMetrics() {
    return this.studentsService.getMetrics();
  }

  @Get(':id')
  @RequirePermissions('student.read')
  @ApiOperation({ summary: 'Get full 360-degree student profile (Parents, Enrollments, Results, Clinicals, Skills)' })
  @ApiParam({ name: 'id', description: 'Student UUID or Student Registration ID' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Post()
  @RequirePermissions('student.create')
  @Audited({ entity: 'Student', action: 'CREATE' })
  @ApiOperation({ summary: 'Register a new student directly' })
  create(@Body() dto: CreateStudentRequestDto) {
    return this.studentsService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('student.update')
  @Audited({ entity: 'Student', action: 'UPDATE' })
  @ApiOperation({ summary: 'Update student profile details' })
  @ApiParam({ name: 'id', description: 'Student UUID' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentRequestDto) {
    return this.studentsService.update(id, dto);
  }

  @Post(':id/parents')
  @RequirePermissions('student.update')
  @Audited({ entity: 'StudentParent', action: 'CREATE' })
  @ApiOperation({ summary: 'Link parent/guardian to student record' })
  @ApiParam({ name: 'id', description: 'Student UUID' })
  addParent(@Param('id') id: string, @Body() dto: AddParentRequestDto) {
    return this.studentsService.addParent(id, dto);
  }

  @Post(':id/documents')
  @RequirePermissions('student.update')
  @Audited({ entity: 'StudentDocument', action: 'CREATE' })
  @ApiOperation({ summary: 'Upload verified student educational document' })
  @ApiParam({ name: 'id', description: 'Student UUID' })
  uploadDocument(@Param('id') id: string, @Body() dto: UploadStudentDocDto) {
    const buffer = Buffer.from(dto.fileBase64, 'base64');
    return this.studentsService.uploadDocument(id, buffer, dto.fileName, dto.mimeType, dto.type);
  }

  @Post(':id/enroll')
  @RequirePermissions('student.update')
  @Audited({ entity: 'StudentEnrollment', action: 'CREATE' })
  @ApiOperation({ summary: 'Enroll student into an active semester cohort & class section' })
  @ApiParam({ name: 'id', description: 'Student UUID' })
  enrollSemester(@Param('id') id: string, @Body() dto: EnrollSemesterRequestDto) {
    return this.studentsService.enrollSemester(id, dto.semesterId, dto.classId);
  }
}
