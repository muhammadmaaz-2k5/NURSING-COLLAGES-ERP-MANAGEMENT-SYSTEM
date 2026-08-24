import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { HospitalService } from './hospital.service';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ModuleType } from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

class CreatePatientDto {
  @ApiProperty({ example: 'PAT-2026-0045' })
  @IsNotEmpty()
  @IsString()
  patientNo: string;

  @ApiProperty({ example: 'Ahmed' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Raza' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+923001122334' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Islamabad' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'B+' })
  @IsOptional()
  @IsString()
  bloodGroup?: string;
}

class PrescriptionItemDto {
  @ApiProperty({ example: 'Paracetamol 500mg' })
  @IsNotEmpty()
  @IsString()
  medicineName: string;

  @ApiProperty({ example: '1 tablet' })
  @IsOptional()
  @IsString()
  dosage?: string;

  @ApiProperty({ example: 'TDS (3 times a day)' })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiProperty({ example: '5 days' })
  @IsOptional()
  @IsString()
  duration?: string;
}

class CreatePrescriptionDto {
  @ApiProperty({ example: 'patient-cuid-123' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'doctor-cuid-123' })
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @ApiProperty({ example: 'RX-2026-901' })
  @IsNotEmpty()
  @IsString()
  prescriptionNo: string;

  @ApiProperty({ example: 'Acute Viral Pharyngitis' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ type: [PrescriptionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}

@ApiTags('Hospital, OPD, IPD & Clinic Management')
@RequireModule(ModuleType.HOSPITAL)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get('profile')
  @RequirePermissions('hospital.patient.read')
  @ApiOperation({ summary: 'Get teaching hospital profile, ward capacities, and patient statistics' })
  getHospitalProfile() {
    return this.hospitalService.getHospitalProfile();
  }

  @Get('doctors')
  @RequirePermissions('hospital.patient.read')
  @ApiOperation({ summary: 'List doctors and consultants' })
  @ApiQuery({ name: 'departmentId', required: false })
  getDoctors(@Query('departmentId') departmentId?: string) {
    return this.hospitalService.getDoctors(departmentId);
  }

  @Get('patients')
  @RequirePermissions('hospital.patient.read')
  @ApiOperation({ summary: 'List and search hospital patients' })
  @ApiQuery({ name: 'search', required: false })
  getPatients(@Query('search') search?: string) {
    return this.hospitalService.getPatients(search);
  }

  @Get('appointments')
  @RequirePermissions('hospital.patient.read')
  @ApiOperation({ summary: 'List OPD appointments' })
  @ApiQuery({ name: 'doctorId', required: false })
  @ApiQuery({ name: 'date', required: false, example: '2026-08-24' })
  getAppointments(@Query('doctorId') doctorId?: string, @Query('date') date?: string) {
    return this.hospitalService.getAppointments(doctorId, date);
  }

  @Get('wards')
  @RequirePermissions('hospital.ward.manage')
  @ApiOperation({ summary: 'List hospital wards, rooms, and live bed occupancy' })
  getWardsAndBeds() {
    return this.hospitalService.getWardsAndBeds();
  }

  @Post('patients')
  @RequirePermissions('hospital.patient.create')
  @ApiOperation({ summary: 'Register a new patient record' })
  createPatient(@Body() dto: CreatePatientDto) {
    return this.hospitalService.createPatient(dto);
  }

  @Post('prescriptions')
  @RequirePermissions('hospital.prescription.create')
  @ApiOperation({ summary: 'Create an e-prescription with multiple medication items' })
  createPrescription(@Body() dto: CreatePrescriptionDto) {
    return this.hospitalService.createPrescription(dto);
  }
}
