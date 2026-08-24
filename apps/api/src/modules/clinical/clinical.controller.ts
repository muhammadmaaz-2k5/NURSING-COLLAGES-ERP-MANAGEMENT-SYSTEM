import {
  Controller,
  Get,
  Post,
  Put,
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
import { ClinicalService } from './clinical.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { ModuleType, ClinicalSiteType, ClinicalStatus, SkillStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';

class CreateClinicalSiteRequestDto {
  @ApiProperty({ example: 'Holy Family Teaching Hospital' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ClinicalSiteType, example: ClinicalSiteType.HOSPITAL })
  @IsEnum(ClinicalSiteType)
  type: ClinicalSiteType;

  @ApiProperty({ example: 'Murree Road, Rawalpindi', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Rawalpindi', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: '+92-51-9290321', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Dr. Shahzad (Medical Superintendent)', required: false })
  @IsOptional()
  @IsString()
  contactPerson?: string;
}

class CreateRotationRequestDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'site-cuid-123' })
  @IsNotEmpty()
  @IsString()
  siteId: string;

  @ApiProperty({ example: 'faculty-cuid-123', required: false })
  @IsOptional()
  @IsString()
  facultyId?: string;

  @ApiProperty({ example: 'Intensive Care Unit (ICU)', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'Critical Care Ward 4', required: false })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiProperty({ example: '2026-09-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-09-30' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Morning shift (08:00 - 14:00)', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

class CreateNursingSkillRequestDto {
  @ApiProperty({ example: 'Intravenous (IV) Cannulation & Infusion' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Aseptic cannulation of peripheral veins with flow rate calibration', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Medication Administration & IV Therapy', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'subject-cuid-123', required: false })
  @IsOptional()
  @IsString()
  subjectId?: string;
}

class RecordSkillAttemptRequestDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'skill-cuid-123' })
  @IsNotEmpty()
  @IsString()
  skillId: string;

  @ApiProperty({ example: 'Performed on adult male patient under senior staff supervision', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

class VerifySkillRequestDto {
  @ApiProperty({ example: 95.0, required: false })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiProperty({ enum: SkillStatus, example: SkillStatus.VERIFIED })
  @IsEnum(SkillStatus)
  status: SkillStatus;

  @ApiProperty({ example: 'Aseptic technique followed meticulously. Candidate declared competent.', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

@ApiTags('Clinical Training & Nursing Skills Logbook')
@RequireModule(ModuleType.CLINICAL_TRAINING)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('clinical')
export class ClinicalController {
  constructor(private readonly clinicalService: ClinicalService) {}

  // ----------------------------------------------------
  // SITES
  // ----------------------------------------------------

  @Get('sites')
  @RequirePermissions('clinical.site.read')
  @ApiOperation({ summary: 'List affiliated teaching hospitals and external clinical sites' })
  @ApiQuery({ name: 'type', enum: ClinicalSiteType, required: false })
  @ApiQuery({ name: 'isActive', required: false })
  getSites(
    @Query('type') type?: ClinicalSiteType,
    @Query('isActive') isActive?: string,
  ) {
    return this.clinicalService.getSites(type, isActive !== undefined ? isActive === 'true' : undefined);
  }

  @Post('sites')
  @RequirePermissions('clinical.site.manage')
  @Audited({ entity: 'ClinicalSite', action: 'CREATE' })
  @ApiOperation({ summary: 'Register a new clinical training partner site' })
  createSite(@Body() dto: CreateClinicalSiteRequestDto) {
    return this.clinicalService.createSite(dto);
  }

  // ----------------------------------------------------
  // ROTATIONS
  // ----------------------------------------------------

  @Get('rotations')
  @RequirePermissions('clinical.training.read')
  @ApiOperation({ summary: 'List student hospital ward rotations and training postings' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'siteId', required: false })
  @ApiQuery({ name: 'facultyId', required: false })
  @ApiQuery({ name: 'status', enum: ClinicalStatus, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getRotations(
    @Query('studentId') studentId?: string,
    @Query('siteId') siteId?: string,
    @Query('facultyId') facultyId?: string,
    @Query('status') status?: ClinicalStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.clinicalService.getRotations({
      studentId,
      siteId,
      facultyId,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post('rotations')
  @RequirePermissions('clinical.training.manage')
  @Audited({ entity: 'ClinicalTraining', action: 'CREATE' })
  @ApiOperation({ summary: 'Schedule student clinical ward rotation (with clash detection)' })
  createRotation(@Body() dto: CreateRotationRequestDto, @CurrentUser() user: any) {
    return this.clinicalService.createRotation(dto, user.id);
  }

  @Patch('rotations/:id/status')
  @RequirePermissions('clinical.training.manage')
  @Audited({ entity: 'ClinicalTraining', action: 'UPDATE' })
  @ApiOperation({ summary: 'Update clinical rotation status (ACTIVE, COMPLETED, CANCELLED)' })
  @ApiParam({ name: 'id', description: 'Rotation UUID' })
  updateRotationStatus(
    @Param('id') id: string,
    @Body('status') status: ClinicalStatus,
    @CurrentUser() user: any,
  ) {
    return this.clinicalService.updateRotationStatus(id, status, user.id);
  }

  // ----------------------------------------------------
  // NURSING SKILLS CATALOG & LOGBOOK
  // ----------------------------------------------------

  @Get('skills')
  @RequirePermissions('clinical.skill.read')
  @ApiOperation({ summary: 'List nursing procedural skills catalog (Vital Signs, Injections, Cannulation, Wound Care)' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'subjectId', required: false })
  getSkills(
    @Query('category') category?: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.clinicalService.getSkills(category, subjectId);
  }

  @Post('skills')
  @RequirePermissions('clinical.skill.manage')
  @Audited({ entity: 'NursingSkill', action: 'CREATE' })
  @ApiOperation({ summary: 'Add a new procedural skill to institutional competency catalog' })
  createSkill(@Body() dto: CreateNursingSkillRequestDto) {
    return this.clinicalService.createSkill(dto);
  }

  @Post('logbook/attempt')
  @RequirePermissions('clinical.skill.create')
  @Audited({ entity: 'StudentSkill', action: 'CREATE' })
  @ApiOperation({ summary: 'Record student procedural clinical practice attempt in logbook' })
  recordSkillAttempt(@Body() dto: RecordSkillAttemptRequestDto) {
    return this.clinicalService.recordSkillAttempt(dto);
  }

  @Post('logbook/:studentId/verify/:skillId')
  @RequirePermissions('clinical.skill.verify')
  @Audited({ entity: 'StudentSkill', action: 'APPROVE' })
  @ApiOperation({ summary: 'Faculty supervisor verifies and grades student clinical logbook skill' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiParam({ name: 'skillId', description: 'Nursing Skill UUID' })
  verifySkill(
    @Param('studentId') studentId: string,
    @Param('skillId') skillId: string,
    @Body() dto: VerifySkillRequestDto,
    @CurrentUser() user: any,
  ) {
    // Look up supervisor faculty record from authenticated user
    const facultyId = user.faculty?.id || user.id;
    return this.clinicalService.verifySkill(studentId, skillId, facultyId, dto);
  }

  // ----------------------------------------------------
  // CLINICAL HOURS & PROGRESS
  // ----------------------------------------------------

  @Get('students/:studentId/progress')
  @RequirePermissions('clinical.training.read')
  @ApiOperation({ summary: 'Get student clinical hours progress (1,200h requirement) and verified skills percentage' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  getStudentProgress(@Param('studentId') studentId: string) {
    return this.clinicalService.getStudentClinicalProgress(studentId);
  }

  @Get('supervisor/:facultyId/dashboard')
  @RequirePermissions('clinical.skill.verify')
  @ApiOperation({ summary: 'Get supervisor clinical dashboard (assigned rotators & pending sign-offs)' })
  @ApiParam({ name: 'facultyId', description: 'Faculty Supervisor UUID' })
  getSupervisorDashboard(@Param('facultyId') facultyId: string) {
    return this.clinicalService.getSupervisorDashboard(facultyId);
  }
}
