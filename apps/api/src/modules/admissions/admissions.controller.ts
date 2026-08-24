import {
  Controller,
  Get,
  Post,
  Patch,
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
import { AdmissionsService } from './admissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdmissionStatus, ApplicationType, Gender, DocumentType } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';

class CreateApplicationRequestDto {
  @ApiProperty({ example: 'program-cuid-123' })
  @IsNotEmpty()
  @IsString()
  programId: string;

  @ApiProperty({ enum: ApplicationType, example: ApplicationType.ONLINE, required: false })
  @IsOptional()
  @IsEnum(ApplicationType)
  type?: ApplicationType;

  @ApiProperty({ example: 'Ayesha' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Bibi', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'ayesha.applicant@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+923014455667' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: '2005-04-12', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: '37405-1234567-2', required: false })
  @IsOptional()
  @IsString()
  cnic?: string;

  @ApiProperty({ example: 'House 14, St 2, G-9/1', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Islamabad', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'FSc Pre-Medical', required: false })
  @IsOptional()
  @IsString()
  previousQualification?: string;

  @ApiProperty({ example: 'Punjab College Islamabad', required: false })
  @IsOptional()
  @IsString()
  previousInstitution?: string;

  @ApiProperty({ example: 88.5, required: false })
  @IsOptional()
  @IsNumber()
  previousPercentage?: number;
}

class ReviewApplicationRequestDto {
  @ApiProperty({ enum: AdmissionStatus, example: AdmissionStatus.APPROVED })
  @IsEnum(AdmissionStatus)
  status: AdmissionStatus;

  @ApiProperty({ example: 'Meets PNC pre-medical merit criteria', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

class EnrollApplicantRequestDto {
  @ApiProperty({ example: 'campus-cuid-123', required: false })
  @IsOptional()
  @IsString()
  campusId?: string;

  @ApiProperty({ example: 'TemporaryPass123!', required: false })
  @IsOptional()
  @IsString()
  temporaryPassword?: string;
}

class UploadDocumentRequestDto {
  @ApiProperty({ enum: DocumentType, example: DocumentType.EDUCATIONAL_CERTIFICATE })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ example: 'fsc_marksheet.pdf' })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsNotEmpty()
  @IsString()
  mimeType: string;

  @ApiProperty({ description: 'Base64 encoded file buffer string' })
  @IsNotEmpty()
  @IsString()
  fileBase64: string;
}

@ApiTags('Admissions & Applications')
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Public endpoint: Submit online or walk-in admission application' })
  apply(@Body() dto: CreateApplicationRequestDto) {
    return this.admissionsService.createApplication(dto);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Upload supporting academic documents for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  uploadDocument(@Param('id') id: string, @Body() dto: UploadDocumentRequestDto) {
    const buffer = Buffer.from(dto.fileBase64, 'base64');
    return this.admissionsService.uploadDocument(id, buffer, dto.fileName, dto.mimeType, dto.type);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('admissions.application.read')
  @ApiOperation({ summary: 'List and filter admission applications' })
  @ApiQuery({ name: 'status', enum: AdmissionStatus, required: false })
  @ApiQuery({ name: 'programId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  findAll(
    @Query('status') status?: AdmissionStatus,
    @Query('programId') programId?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.admissionsService.findAll({
      status,
      programId,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('metrics')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('admissions.application.read')
  @ApiOperation({ summary: 'Get admission pipeline statistics' })
  getMetrics() {
    return this.admissionsService.getMetrics();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('admissions.application.read')
  @ApiOperation({ summary: 'Get full admission application details with uploaded documents' })
  @ApiParam({ name: 'id', description: 'Application UUID or Application No' })
  findOne(@Param('id') id: string) {
    return this.admissionsService.findOne(id);
  }

  @Patch(':id/review')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('admissions.application.manage')
  @ApiOperation({ summary: 'Review and transition admission status (APPROVED, REJECTED, WAITING_LIST)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  review(
    @Param('id') id: string,
    @Body() dto: ReviewApplicationRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.admissionsService.reviewApplication(id, dto.status, dto.remarks, user.id);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('admissions.application.manage')
  @ApiOperation({ summary: 'Atomically enroll approved applicant into Student record & User portal account' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  enroll(
    @Param('id') id: string,
    @Body() dto: EnrollApplicantRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.admissionsService.enrollApplicant(id, dto, user.id);
  }
}
