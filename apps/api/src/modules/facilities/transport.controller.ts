import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProperty,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransportService } from './transport.service';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ModuleType } from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';

class CreateVehicleDto {
  @ApiProperty({ example: 'ICT-BUS-904' })
  @IsNotEmpty()
  @IsString()
  registrationNo: string;

  @ApiProperty({ example: 'Main Campus Coaster 04', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Toyota Coaster 32-Seater', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ example: 32, required: false })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiProperty({ example: 'Muhammad Rafiq', required: false })
  @IsOptional()
  @IsString()
  driverName?: string;

  @ApiProperty({ example: '+923009988776', required: false })
  @IsOptional()
  @IsString()
  driverPhone?: string;
}

class CreateRouteDto {
  @ApiProperty({ example: 'veh-cuid-123' })
  @IsNotEmpty()
  @IsString()
  vehicleId: string;

  @ApiProperty({ example: 'Route 1 - Rawalpindi Saddar to Campus' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Saddar Metro Station', required: false })
  @IsOptional()
  @IsString()
  startPoint?: string;

  @ApiProperty({ example: 'Healthcare College Main Gate', required: false })
  @IsOptional()
  @IsString()
  endPoint?: string;
}

class CreateStopDto {
  @ApiProperty({ example: 'route-cuid-123' })
  @IsNotEmpty()
  @IsString()
  routeId: string;

  @ApiProperty({ example: 'Faizabad Interchange Stop' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  sequence: number;

  @ApiProperty({ example: '07:20 AM', required: false })
  @IsOptional()
  @IsString()
  pickupTime?: string;
}

class AssignTransportDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'veh-cuid-123' })
  @IsNotEmpty()
  @IsString()
  vehicleId: string;

  @ApiProperty({ example: 'stop-cuid-123', required: false })
  @IsOptional()
  @IsString()
  stopId?: string;

  @ApiProperty({ example: '2026-09-01' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2027-08-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@ApiTags('Transport & Fleet Management')
@RequireModule(ModuleType.TRANSPORT)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get('dashboard')
  @RequirePermissions('transport.read')
  @ApiOperation({ summary: 'Get transport fleet metrics, capacity utilization rate, and routes' })
  getDashboard() {
    return this.transportService.getTransportDashboard();
  }

  @Get('vehicles')
  @RequirePermissions('transport.read')
  @ApiOperation({ summary: 'List fleet vehicles, active seating occupancy, and driver logs' })
  getVehicles() {
    return this.transportService.getVehicles();
  }

  @Post('vehicles')
  @RequirePermissions('transport.vehicle.manage')
  @Audited({ entity: 'Vehicle', action: 'CREATE' })
  @ApiOperation({ summary: 'Register a new transport vehicle with driver and capacity details' })
  createVehicle(@Body() dto: CreateVehicleDto, @CurrentUser() user: any) {
    return this.transportService.createVehicle(dto, user?.id);
  }

  @Get('routes')
  @RequirePermissions('transport.read')
  @ApiOperation({ summary: 'List bus routes with assigned sequence stops and schedules' })
  getRoutes() {
    return this.transportService.getRoutes();
  }

  @Post('routes')
  @RequirePermissions('transport.route.manage')
  @Audited({ entity: 'TransportRoute', action: 'CREATE' })
  @ApiOperation({ summary: 'Define a new transport route' })
  createRoute(@Body() dto: CreateRouteDto) {
    return this.transportService.createRoute(dto);
  }

  @Post('stops')
  @RequirePermissions('transport.route.manage')
  @Audited({ entity: 'TransportStop', action: 'CREATE' })
  @ApiOperation({ summary: 'Add a scheduled stop to a route' })
  createStop(@Body() dto: CreateStopDto) {
    return this.transportService.createStop(dto);
  }

  @Post('assignments')
  @RequirePermissions('transport.assignment.manage')
  @Audited({ entity: 'TransportAssignment', action: 'CREATE' })
  @ApiOperation({ summary: 'Issue bus pass and assign student to vehicle with seating capacity enforcement' })
  assignTransport(@Body() dto: AssignTransportDto, @CurrentUser() user: any) {
    return this.transportService.assignTransport(dto, user?.id);
  }

  @Post('assignments/:id/cancel')
  @RequirePermissions('transport.assignment.manage')
  @Audited({ entity: 'TransportAssignment', action: 'UPDATE' })
  @ApiOperation({ summary: 'Cancel active transport bus pass assignment' })
  @ApiParam({ name: 'id', description: 'Assignment UUID' })
  cancelAssignment(@Param('id') id: string, @CurrentUser() user: any) {
    return this.transportService.cancelAssignment(id, user?.id);
  }
}
