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
import { HostelService } from './hostel.service';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ModuleType, Gender, HostelRoomType } from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';

class CreateHostelDto {
  @ApiProperty({ example: 'Fatima Jinnah Female Hostel' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'HST-F-01' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: 'Campus Sector H-8/4, Islamabad', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

class CreateHostelRoomDto {
  @ApiProperty({ example: 'hostel-cuid-123' })
  @IsNotEmpty()
  @IsString()
  hostelId: string;

  @ApiProperty({ example: 'R-201' })
  @IsNotEmpty()
  @IsString()
  roomNumber: string;

  @ApiProperty({ example: '2nd Floor', required: false })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({ enum: HostelRoomType, example: HostelRoomType.DOUBLE, required: false })
  @IsOptional()
  @IsEnum(HostelRoomType)
  type?: HostelRoomType;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  capacity?: number;
}

class CreateHostelBedDto {
  @ApiProperty({ example: 'room-cuid-123' })
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @ApiProperty({ example: 'BED-201A' })
  @IsNotEmpty()
  @IsString()
  bedNumber: string;
}

class AllocateHostelBedDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'bed-cuid-123' })
  @IsNotEmpty()
  @IsString()
  bedId: string;

  @ApiProperty({ example: '2026-09-01' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2027-08-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 'Fall semester hostel allotment', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

class TransferBedDto {
  @ApiProperty({ example: 'target-bed-cuid-123' })
  @IsNotEmpty()
  @IsString()
  targetBedId: string;
}

class CheckOutDto {
  @ApiProperty({ example: 'Completed semester tenure and room clearance handed over', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

@ApiTags('Hostel & Accommodation Management')
@RequireModule(ModuleType.HOSTEL)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  @Get('dashboard')
  @RequirePermissions('hostel.read')
  @ApiOperation({ summary: 'Get hostel occupancy rate, bed availability meter, and building stats' })
  getDashboard() {
    return this.hostelService.getHostelDashboard();
  }

  @Get('hostels')
  @RequirePermissions('hostel.read')
  @ApiOperation({ summary: 'List hostels, rooms, and active bed allocations' })
  getHostels() {
    return this.hostelService.getHostels();
  }

  @Post('hostels')
  @RequirePermissions('hostel.manage')
  @Audited({ entity: 'Hostel', action: 'CREATE' })
  @ApiOperation({ summary: 'Register a new hostel building' })
  createHostel(@Body() dto: CreateHostelDto, @CurrentUser() user: any) {
    return this.hostelService.createHostel(dto, user?.id);
  }

  @Post('rooms')
  @RequirePermissions('hostel.room.manage')
  @Audited({ entity: 'HostelRoom', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a hostel room and auto-generate bed records' })
  createRoom(@Body() dto: CreateHostelRoomDto, @CurrentUser() user: any) {
    return this.hostelService.createRoom(dto, user?.id);
  }

  @Post('beds')
  @RequirePermissions('hostel.bed.manage')
  @Audited({ entity: 'HostelBed', action: 'CREATE' })
  @ApiOperation({ summary: 'Add a new bed to a hostel room' })
  createBed(@Body() dto: CreateHostelBedDto) {
    return this.hostelService.createBed(dto);
  }

  @Post('allocations')
  @RequirePermissions('hostel.allocation.create')
  @Audited({ entity: 'HostelAllocation', action: 'CREATE' })
  @ApiOperation({ summary: 'Allocate hostel bed to student with single-occupant isolation guarantee' })
  allocateBed(@Body() dto: AllocateHostelBedDto, @CurrentUser() user: any) {
    return this.hostelService.allocateBed(dto, user?.id);
  }

  @Post('allocations/:id/transfer')
  @RequirePermissions('hostel.allocation.transfer')
  @Audited({ entity: 'HostelAllocation', action: 'UPDATE' })
  @ApiOperation({ summary: 'Transfer student from current bed to a new available bed' })
  @ApiParam({ name: 'id', description: 'Allocation UUID' })
  transferBed(
    @Param('id') id: string,
    @Body() dto: TransferBedDto,
    @CurrentUser() user: any,
  ) {
    return this.hostelService.transferBed(id, dto.targetBedId, user?.id);
  }

  @Post('allocations/:id/checkout')
  @RequirePermissions('hostel.allocation.checkout')
  @Audited({ entity: 'HostelAllocation', action: 'UPDATE' })
  @ApiOperation({ summary: 'Check out student and release bed back to AVAILABLE' })
  @ApiParam({ name: 'id', description: 'Allocation UUID' })
  checkOut(
    @Param('id') id: string,
    @Body() dto: CheckOutDto,
    @CurrentUser() user: any,
  ) {
    return this.hostelService.checkOut(id, dto.remarks, user?.id);
  }
}
