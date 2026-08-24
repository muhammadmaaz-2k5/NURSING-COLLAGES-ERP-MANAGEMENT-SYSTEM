import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

class CreateRoleDto {
  @ApiProperty({ example: 'EXAM_CONTROLLER' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Controller of semester and clinical examinations', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class AssignPermissionsDto {
  @ApiProperty({ example: ['permission-cuid-1', 'permission-cuid-2'] })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}

class AssignUserRoleDto {
  @ApiProperty({ example: 'FACULTY' })
  @IsNotEmpty()
  @IsString()
  roleName: string;
}

@ApiTags('RBAC - Roles & Permissions Administration')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('roles')
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'List all system and custom roles with their permission matrices' })
  getRoles() {
    return this.rbacService.getRoles();
  }

  @Get('permissions')
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'List all granular system permissions' })
  getPermissions() {
    return this.rbacService.getPermissions();
  }

  @Post('roles')
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'Create a new custom role' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(dto.name, dto.description);
  }

  @Post('roles/:roleId/permissions')
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'Assign permission matrix to a role' })
  assignPermissions(
    @Param('roleId') roleId: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rbacService.assignPermissionsToRole(roleId, dto.permissionIds);
  }

  @Post('users/:userId/roles')
  @RequirePermissions('system.user.manage')
  @ApiOperation({ summary: 'Assign a role to a user' })
  assignUserRole(
    @Param('userId') userId: string,
    @Body() dto: AssignUserRoleDto,
  ) {
    return this.rbacService.assignRoleToUser(userId, dto.roleName);
  }
}
