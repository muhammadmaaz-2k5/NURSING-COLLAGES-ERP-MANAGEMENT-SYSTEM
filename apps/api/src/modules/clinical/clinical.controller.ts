import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicalService } from './clinical.service';
import { ClinicalStatus, SkillStatus, ModuleType } from '@prisma/client';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

class VerifySkillDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'skill-cuid-123' })
  @IsNotEmpty()
  @IsString()
  skillId: string;

  @ApiProperty({ example: 'faculty-cuid-123' })
  @IsNotEmpty()
  @IsString()
  verifiedBy: string;

  @ApiProperty({ example: 95.0, required: false })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiProperty({ example: 'Demonstrated aseptic technique flawlessly', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty({ enum: SkillStatus, example: SkillStatus.VERIFIED })
  @IsEnum(SkillStatus)
  status: SkillStatus;
}

@ApiTags('Clinical Rotations & Nursing Skills')
@RequireModule(ModuleType.CLINICAL_TRAINING)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('clinical')
export class ClinicalController {
  constructor(private readonly clinicalService: ClinicalService) {}

  @Get('sites')
  @RequirePermissions('clinical.site.read')
  @ApiOperation({ summary: 'List external and internal hospital clinical training sites' })
  getSites() {
    return this.clinicalService.getSites();
  }

  @Get('trainings')
  @RequirePermissions('clinical.training.read')
  @ApiOperation({ summary: 'List student clinical rotations and ward training allocations' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'status', enum: ClinicalStatus, required: false })
  getTrainings(@Query('studentId') studentId?: string, @Query('status') status?: ClinicalStatus) {
    return this.clinicalService.getTrainings(studentId, status);
  }

  @Get('skills')
  @RequirePermissions('clinical.site.read')
  @ApiOperation({ summary: 'List official nursing competency and procedural skill definitions' })
  getNursingSkills() {
    return this.clinicalService.getNursingSkills();
  }

  @Get('students/:studentId/skills')
  @RequirePermissions('clinical.training.read')
  @ApiOperation({ summary: 'Get nursing skills logbook and sign-off status for a student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  getStudentSkills(@Param('studentId') studentId: string) {
    return this.clinicalService.getStudentSkills(studentId);
  }

  @Post('verify-skill')
  @RequirePermissions('clinical.skill.verify')
  @ApiOperation({ summary: 'Faculty supervisor verifies and grades a nursing clinical skill' })
  verifySkill(@Body() dto: VerifySkillDto) {
    return this.clinicalService.verifySkill(dto);
  }
}
