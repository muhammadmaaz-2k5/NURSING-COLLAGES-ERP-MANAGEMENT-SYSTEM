import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiProperty,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HospitalService } from './hospital.service';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ModuleType,
  HospitalDepartmentType,
  HospitalBedType,
  AppointmentStatus,
  PatientStatus,
  Gender,
  LabTestStatus,
} from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';

class CreateDepartmentDto {
  @ApiProperty({ example: 'Cardiology OPD' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: HospitalDepartmentType, example: HospitalDepartmentType.OPD })
  @IsEnum(HospitalDepartmentType)
  type: HospitalDepartmentType;

  @ApiProperty({ example: 'Cardiac diagnostic and consultation unit', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class CreateWardDto {
  @ApiProperty({ example: 'General Medical Ward 3' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'dept-cuid-123', required: false })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiProperty({ example: '2nd Floor', required: false })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsNumber()
  capacity?: number;
}

class CreateBedDto {
  @ApiProperty({ example: 'ward-cuid-123' })
  @IsNotEmpty()
  @IsString()
  wardId: string;

  @ApiProperty({ example: 'BED-304A' })
  @IsNotEmpty()
  @IsString()
  bedNumber: string;

  @ApiProperty({ enum: HospitalBedType, example: HospitalBedType.GENERAL, required: false })
  @IsOptional()
  @IsEnum(HospitalBedType)
  type?: HospitalBedType;
}

class CreateDoctorDto {
  @ApiProperty({ example: 'Dr. Sarah Tariq' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'dept-cuid-123', required: false })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiProperty({ example: 'EMP-DOC-009', required: false })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ example: 'Cardiologist', required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ example: 'MBBS, FCPS Cardiology', required: false })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiProperty({ example: 'PMDC-112233-S', required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ example: '+923001234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'sarah.tariq@hospital.edu.pk', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Mon-Fri: 09:00 - 14:00', required: false })
  @IsOptional()
  @IsString()
  availability?: string;
}

class CreatePatientDto {
  @ApiProperty({ example: 'MRN-2026-00045', required: false })
  @IsOptional()
  @IsString()
  patientNo?: string;

  @ApiProperty({ example: 'Ahmed' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Raza', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '1985-04-12', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: '+923001122334', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'House 14, St 9, F-8/2', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Islamabad', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'B+', required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({ example: 'Muhammad Raza (Brother)', required: false })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({ example: '+923331122334', required: false })
  @IsOptional()
  @IsString()
  emergencyPhone?: string;

  @ApiProperty({ example: 'Penicillin, Dust', required: false })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiProperty({ example: 'Hypertension, Type-2 Diabetes', required: false })
  @IsOptional()
  @IsString()
  medicalHistory?: string;
}

class CreateAppointmentDto {
  @ApiProperty({ example: 'patient-cuid-123' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'doctor-cuid-123' })
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @ApiProperty({ example: 'dept-cuid-123', required: false })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiProperty({ example: '2026-08-25T10:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  appointmentDate: string;

  @ApiProperty({ example: 'Chest discomfort on exertion', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ example: 'First visit', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class CreateConsultationDto {
  @ApiProperty({ example: 'app-cuid-123', required: false })
  @IsOptional()
  @IsString()
  appointmentId?: string;

  @ApiProperty({ example: 'patient-cuid-123' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'doctor-cuid-123' })
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @ApiProperty({ example: 'Shortness of breath, dry cough for 3 days', required: false })
  @IsOptional()
  @IsString()
  symptoms?: string;

  @ApiProperty({ example: 'Acute Bronchitis' })
  @IsNotEmpty()
  @IsString()
  diagnosis: string;

  @ApiProperty({ example: 'Advised rest, hydration, nebulization with saline', required: false })
  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @ApiProperty({ example: { bp: '120/80', pulse: 78, temp: 99.1, spo2: 98 }, required: false })
  @IsOptional()
  vitalSigns?: Record<string, any>;

  @ApiProperty({ example: '2026-09-02', required: false })
  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}

class CreateAdmissionDto {
  @ApiProperty({ example: 'patient-cuid-123' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'bed-cuid-123' })
  @IsNotEmpty()
  @IsString()
  bedId: string;

  @ApiProperty({ example: 'Acute Appendicitis', required: false })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ example: 'Emergency admission for pre-op observation', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class TransferBedDto {
  @ApiProperty({ example: 'new-bed-cuid-123' })
  @IsNotEmpty()
  @IsString()
  targetBedId: string;
}

class DischargePatientDto {
  @ApiProperty({ example: 'Post-op recovery satisfactory. Wound healing well. Oral medications prescribed for 7 days.' })
  @IsOptional()
  @IsString()
  dischargeSummary?: string;
}

class PrescriptionItemDto {
  @ApiProperty({ example: 'Augmentin 625mg' })
  @IsNotEmpty()
  @IsString()
  medicineName: string;

  @ApiProperty({ example: '1 tablet', required: false })
  @IsOptional()
  @IsString()
  dosage?: string;

  @ApiProperty({ example: 'BD (Twice a day)', required: false })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiProperty({ example: '7 days', required: false })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({ example: 'Take after meals', required: false })
  @IsOptional()
  @IsString()
  instructions?: string;
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

  @ApiProperty({ example: 'RX-2026-901', required: false })
  @IsOptional()
  @IsString()
  prescriptionNo?: string;

  @ApiProperty({ example: 'Upper Respiratory Tract Infection', required: false })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ example: 'Review after 5 days if fever persists', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [PrescriptionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}

class OrderLabTestDto {
  @ApiProperty({ example: 'patient-cuid-123' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'Complete Blood Count (CBC) with ESR' })
  @IsNotEmpty()
  @IsString()
  testName: string;
}

@ApiTags('Hospital, OPD, IPD & Clinic Management')
@RequireModule(ModuleType.HOSPITAL)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  // ----------------------------------------------------
  // PROFILE & OVERVIEW
  // ----------------------------------------------------

  @Get('profile')
  @RequirePermissions('hospital.read')
  @ApiOperation({ summary: 'Get teaching hospital profile, live bed occupancy meters, and KPI statistics' })
  getHospitalProfile() {
    return this.hospitalService.getHospitalProfile();
  }

  // ----------------------------------------------------
  // DEPARTMENTS, WARDS & BEDS
  // ----------------------------------------------------

  @Get('departments')
  @RequirePermissions('hospital.read')
  @ApiOperation({ summary: 'List hospital departments with doctors and ward allocations' })
  getDepartments() {
    return this.hospitalService.getDepartments();
  }

  @Post('departments')
  @RequirePermissions('hospital.manage')
  @Audited({ entity: 'HospitalDepartment', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a hospital clinical department (OPD, Emergency, Surgery, etc.)' })
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.hospitalService.createDepartment(dto);
  }

  @Get('wards')
  @RequirePermissions('hospital.read')
  @ApiOperation({ summary: 'List hospital wards, rooms, and live bed occupancy status' })
  getWardsAndBeds() {
    return this.hospitalService.getWards();
  }

  @Post('wards')
  @RequirePermissions('hospital.bed.manage')
  @Audited({ entity: 'HospitalWard', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a hospital inpatient ward' })
  createWard(@Body() dto: CreateWardDto) {
    return this.hospitalService.createWard(dto);
  }

  @Post('beds')
  @RequirePermissions('hospital.bed.manage')
  @Audited({ entity: 'HospitalBed', action: 'CREATE' })
  @ApiOperation({ summary: 'Add a new bed to a hospital ward' })
  createBed(@Body() dto: CreateBedDto) {
    return this.hospitalService.createBed(dto);
  }

  // ----------------------------------------------------
  // DOCTORS & CLINICAL ROSTER
  // ----------------------------------------------------

  @Get('doctors')
  @RequirePermissions('hospital.read')
  @ApiOperation({ summary: 'List doctors, consultants, and availability schedules' })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  getDoctors(
    @Query('departmentId') departmentId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.hospitalService.getDoctors(
      departmentId,
      isActive !== undefined ? isActive === 'true' : undefined,
    );
  }

  @Post('doctors')
  @RequirePermissions('hospital.manage')
  @Audited({ entity: 'Doctor', action: 'CREATE' })
  @ApiOperation({ summary: 'Register a doctor or clinical consultant' })
  createDoctor(@Body() dto: CreateDoctorDto) {
    return this.hospitalService.createDoctor(dto);
  }

  // ----------------------------------------------------
  // PATIENTS MANAGEMENT (SEPARATE IDENTITY FROM STUDENT)
  // ----------------------------------------------------

  @Get('patients')
  @RequirePermissions('hospital.patient.read')
  @ApiOperation({ summary: 'List, paginate, and search patient medical records by name, MRN, or phone' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: PatientStatus, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getPatients(
    @Query('search') search?: string,
    @Query('status') status?: PatientStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.hospitalService.getPatients({
      search,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('patients/:id')
  @RequirePermissions('hospital.patient.read')
  @ApiOperation({ summary: 'Get full patient history, consultations, prescriptions, admissions, and lab results' })
  @ApiParam({ name: 'id', description: 'Patient UUID' })
  getPatientById(@Param('id') id: string) {
    return this.hospitalService.getPatientById(id);
  }

  @Post('patients')
  @RequirePermissions('hospital.patient.create')
  @Audited({ entity: 'Patient', action: 'CREATE' })
  @ApiOperation({ summary: 'Register a new patient record with demographics, blood group, and allergy history' })
  createPatient(@Body() dto: CreatePatientDto, @CurrentUser() user: any) {
    return this.hospitalService.createPatient(dto, user?.id);
  }

  // ----------------------------------------------------
  // OPD: APPOINTMENTS & CONSULTATIONS
  // ----------------------------------------------------

  @Get('appointments')
  @RequirePermissions('hospital.read')
  @ApiOperation({ summary: 'List OPD appointments with doctor assignment and date filtering' })
  @ApiQuery({ name: 'doctorId', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'status', enum: AppointmentStatus, required: false })
  @ApiQuery({ name: 'date', required: false, example: '2026-08-25' })
  getAppointments(
    @Query('doctorId') doctorId?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: AppointmentStatus,
    @Query('date') date?: string,
  ) {
    return this.hospitalService.getAppointments({ doctorId, patientId, status, date });
  }

  @Post('appointments')
  @RequirePermissions('hospital.appointment.manage')
  @Audited({ entity: 'Appointment', action: 'CREATE' })
  @ApiOperation({ summary: 'Schedule an OPD patient appointment with sequential token allocation' })
  createAppointment(@Body() dto: CreateAppointmentDto, @CurrentUser() user: any) {
    return this.hospitalService.createAppointment(dto, user?.id);
  }

  @Post('consultations')
  @RequirePermissions('hospital.consultation.create')
  @Audited({ entity: 'Consultation', action: 'CREATE' })
  @ApiOperation({ summary: 'Record clinical OPD consultation, diagnosis, vital signs, and complete appointment' })
  createConsultation(@Body() dto: CreateConsultationDto, @CurrentUser() user: any) {
    return this.hospitalService.createConsultation(dto, user?.id);
  }

  // ----------------------------------------------------
  // IPD: ADMISSIONS, TRANSFERS & DISCHARGES (CONCURRENCY PROTECTED)
  // ----------------------------------------------------

  @Post('admissions')
  @RequirePermissions('hospital.admission.manage')
  @Audited({ entity: 'PatientAdmission', action: 'CREATE' })
  @ApiOperation({ summary: 'Admit patient to ward and bed with strict transactional double-occupancy protection' })
  admitPatient(@Body() dto: CreateAdmissionDto, @CurrentUser() user: any) {
    return this.hospitalService.admitPatient(dto, user?.id);
  }

  @Post('admissions/:id/transfer')
  @RequirePermissions('hospital.admission.manage')
  @Audited({ entity: 'PatientAdmission', action: 'UPDATE' })
  @ApiOperation({ summary: 'Transfer active inpatient to a different available bed atomically' })
  @ApiParam({ name: 'id', description: 'Admission UUID' })
  transferPatientBed(
    @Param('id') id: string,
    @Body() dto: TransferBedDto,
    @CurrentUser() user: any,
  ) {
    return this.hospitalService.transferPatientBed(id, dto.targetBedId, user?.id);
  }

  @Post('admissions/:id/discharge')
  @RequirePermissions('hospital.admission.manage')
  @Audited({ entity: 'PatientAdmission', action: 'UPDATE' })
  @ApiOperation({ summary: 'Discharge inpatient, record discharge summary, and release bed back to AVAILABLE' })
  @ApiParam({ name: 'id', description: 'Admission UUID' })
  dischargePatient(
    @Param('id') id: string,
    @Body() dto: DischargePatientDto,
    @CurrentUser() user: any,
  ) {
    return this.hospitalService.dischargePatient(id, dto, user?.id);
  }

  // ----------------------------------------------------
  // PRESCRIPTIONS & LAB ORDERS
  // ----------------------------------------------------

  @Get('prescriptions')
  @RequirePermissions('hospital.read')
  @ApiOperation({ summary: 'List prescriptions' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'doctorId', required: false })
  getPrescriptions(
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.hospitalService.getPrescriptions({ patientId, doctorId });
  }

  @Post('prescriptions')
  @RequirePermissions('hospital.prescription.create')
  @Audited({ entity: 'Prescription', action: 'CREATE' })
  @ApiOperation({ summary: 'Generate an electronic prescription with dosage and frequency' })
  createPrescription(@Body() dto: CreatePrescriptionDto, @CurrentUser() user: any) {
    return this.hospitalService.createPrescription(dto, user?.id);
  }

  @Get('lab-tests')
  @RequirePermissions('hospital.read')
  @ApiOperation({ summary: 'List ordered laboratory investigations' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'status', enum: LabTestStatus, required: false })
  getLabTests(
    @Query('patientId') patientId?: string,
    @Query('status') status?: LabTestStatus,
  ) {
    return this.hospitalService.getLabTests({ patientId, status });
  }

  @Post('lab-tests')
  @RequirePermissions('hospital.lab.manage')
  @Audited({ entity: 'LabTest', action: 'CREATE' })
  @ApiOperation({ summary: 'Order a diagnostic lab test for a patient' })
  orderLabTest(@Body() dto: OrderLabTestDto, @CurrentUser() user: any) {
    return this.hospitalService.orderLabTest(dto, user?.id);
  }
}

