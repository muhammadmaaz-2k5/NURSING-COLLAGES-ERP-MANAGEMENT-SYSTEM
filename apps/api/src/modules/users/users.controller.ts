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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { UserStatus } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsArray, MinLength } from 'class-validator';

class CreateUserRequestDto {
  @ApiProperty({ example: 'instructor@nmc.edu.pk' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Dr. Tariq' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Mahmood', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+923001234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: ['FACULTY'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleNames?: string[];
}

class UpdateUserRequestDto {
  @ApiProperty({ example: 'Dr. Tariq', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Mahmood', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+923001234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: UserStatus, required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({ example: ['FACULTY', 'DEAN'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleNames?: string[];
}

class SetUserStatusDto {
  @ApiProperty({ enum: UserStatus, example: UserStatus.SUSPENDED })
  @IsEnum(UserStatus)
  status: UserStatus;
}

@ApiTags('Users Administration')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'List and filter users with search, role filters, and pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: UserStatus, required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: UserStatus,
    @Query('role') role?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findAll({
      search,
      status,
      role,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'Get user details with roles and linked profiles' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @RequirePermissions('system.user.manage')
  @Audited({ entity: 'User', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a new user account with assigned roles' })
  create(@Body() dto: CreateUserRequestDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('system.user.manage')
  @Audited({ entity: 'User', action: 'UPDATE' })
  @ApiOperation({ summary: 'Update user profile, status, or assigned roles' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  update(@Param('id') id: string, @Body() dto: UpdateUserRequestDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/status')
  @RequirePermissions('system.user.manage')
  @Audited({ entity: 'User', action: 'UPDATE' })
  @ApiOperation({ summary: 'Activate, deactivate, or suspend a user account' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  setStatus(@Param('id') id: string, @Body() dto: SetUserStatusDto) {
    return this.usersService.setStatus(id, dto.status);
  }
}
