import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { CollegeService } from './college.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { IsOptional, IsString, IsObject } from 'class-validator';

class UpdateCollegeRequestDto {
  @ApiProperty({ example: 'National Medical & Nursing College', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'NMC-01', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'https://cdn.example.com/logo.png', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ example: 'info@nmc.edu.pk', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '+92-51-111-222-333', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'https://nmc.edu.pk', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: 'Sector H-8/4, Islamabad', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Islamabad', required: false })
  @IsOptional()
  @IsString()
  city?: string;
}

class UpdateCollegeSettingsRequestDto {
  @ApiProperty({ example: 'Asia/Karachi', required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ example: 'PKR', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    example: {
      passingPercentage: 50,
      scales: [
        { grade: 'A+', minPercentage: 85, gpa: 4.0 },
        { grade: 'A', minPercentage: 80, gpa: 3.7 },
        { grade: 'B', minPercentage: 70, gpa: 3.0 },
        { grade: 'C', minPercentage: 60, gpa: 2.5 },
        { grade: 'D', minPercentage: 50, gpa: 2.0 },
        { grade: 'F', minPercentage: 0, gpa: 0.0 },
      ],
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  gradingSystem?: Record<string, any>;

  @ApiProperty({
    example: { minAttendancePercentage: 75, allowLateMinutes: 15 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  attendanceSettings?: Record<string, any>;

  @ApiProperty({
    example: { allowInstallments: true, lateFeePerDay: 100 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  feeSettings?: Record<string, any>;
}

@ApiTags('College Settings & Profile')
@Controller('college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Get()
  @ApiOperation({ summary: 'Get current college instance profile, settings, and active modules' })
  getProfile() {
    return this.collegeService.getProfile();
  }

  @Put()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('system.settings.manage')
  @Audited({ entity: 'College', action: 'UPDATE' })
  @ApiOperation({ summary: 'Update college instance institutional metadata' })
  updateProfile(@Body() dto: UpdateCollegeRequestDto) {
    return this.collegeService.updateProfile(dto);
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('system.settings.manage')
  @Audited({ entity: 'CollegeSettings', action: 'UPDATE' })
  @ApiOperation({ summary: 'Update institutional settings (PNC grading scale, timezone, currency, policies)' })
  updateSettings(@Body() dto: UpdateCollegeSettingsRequestDto) {
    return this.collegeService.updateSettings(dto);
  }
}
