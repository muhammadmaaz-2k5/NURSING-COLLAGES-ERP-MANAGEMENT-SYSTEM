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
import { FacultyService } from './faculty.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

class CreateFacultyRequestDto {
  @ApiProperty({ example: 'nusrat.parveen@nmc.edu.pk' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Faculty@123', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'Prof. Dr. Nusrat' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Parveen', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'department-cuid-123' })
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @ApiProperty({ example: 'campus-cuid-123', required: false })
  @IsOptional()
  @IsString()
  campusId?: string;

  @ApiProperty({ example: 'Professor & Dean of Nursing' })
  @IsNotEmpty()
  @IsString()
  designation: string;

  @ApiProperty({ example: 'PhD Nursing, MSN, RN, RM' })
  @IsNotEmpty()
  @IsString()
  qualification: string;

  @ApiProperty({ example: 'Critical Care & Nursing Education', required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ example: '+923001239988', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '2020-01-15', required: false })
  @IsOptional()
  @IsDateString()
  joiningDate?: string;
}

class UpdateFacultyRequestDto {
  @ApiProperty({ example: 'Prof. Dr. Nusrat', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Parveen', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'Professor & Dean of Nursing', required: false })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({ example: 'PhD Nursing, MSN', required: false })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiProperty({ example: 'Critical Care', required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ example: '+923001239988', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

@ApiTags('Faculty & Academic Workload')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  @RequirePermissions('faculty.read')
  @ApiOperation({ summary: 'List faculty members and academic designations' })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'campusId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  findAll(
    @Query('departmentId') departmentId?: string,
    @Query('campusId') campusId?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.facultyService.findAll({
      departmentId,
      campusId,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @RequirePermissions('faculty.read')
  @ApiOperation({ summary: 'Get faculty member profile and allocated course assignments' })
  @ApiParam({ name: 'id', description: 'Faculty UUID or Employee ID' })
  findOne(@Param('id') id: string) {
    return this.facultyService.findOne(id);
  }

  @Get(':id/workload')
  @RequirePermissions('faculty.read')
  @ApiOperation({ summary: 'Get weekly teaching workload, credit hours, and allocated sections' })
  @ApiParam({ name: 'id', description: 'Faculty UUID' })
  getWorkload(@Param('id') id: string) {
    return this.facultyService.getWorkload(id);
  }

  @Post()
  @RequirePermissions('faculty.create')
  @Audited({ entity: 'Faculty', action: 'CREATE' })
  @ApiOperation({ summary: 'Create new faculty instructor profile and user account' })
  create(@Body() dto: CreateFacultyRequestDto) {
    return this.facultyService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('faculty.update')
  @Audited({ entity: 'Faculty', action: 'UPDATE' })
  @ApiOperation({ summary: 'Update faculty member credentials or designation' })
  @ApiParam({ name: 'id', description: 'Faculty UUID' })
  update(@Param('id') id: string, @Body() dto: UpdateFacultyRequestDto) {
    return this.facultyService.update(id, dto);
  }
}
