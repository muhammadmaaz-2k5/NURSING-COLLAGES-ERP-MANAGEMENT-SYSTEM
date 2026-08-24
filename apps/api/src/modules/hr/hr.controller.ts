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
import { HrService } from './hr.service';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { EmploymentStatus, LeaveStatus, LeaveType, ModuleType, PayrollStatus } from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { Idempotent } from '../../common/database/idempotency.decorator';

class CreateEmployeeDto {
  @ApiProperty({ example: 'EMP-2026-0088', required: false })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ example: 'dept-cuid-123', required: false })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiProperty({ example: 'Tariq' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Mehmood', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'Senior Nursing Clinical Instructor' })
  @IsNotEmpty()
  @IsString()
  designation: string;

  @ApiProperty({ example: 'MSN Nursing, RN', required: false })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiProperty({ example: '2026-01-15', required: false })
  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @ApiProperty({ example: '+923001234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'tariq.mehmood@college.edu.pk', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 85000 })
  @IsNumber()
  basicSalary: number;
}

class ApplyLeaveDto {
  @ApiProperty({ example: 'emp-cuid-123' })
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @ApiProperty({ enum: LeaveType, example: LeaveType.CASUAL })
  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @ApiProperty({ example: '2026-09-10' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-09-12' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Family wedding event', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

class UpdateLeaveStatusDto {
  @ApiProperty({ enum: LeaveStatus, example: LeaveStatus.APPROVED })
  @IsEnum(LeaveStatus)
  status: LeaveStatus;
}

class ProcessPayrollDto {
  @ApiProperty({ example: 8 })
  @IsNumber()
  month: number;

  @ApiProperty({ example: 2026 })
  @IsNumber()
  year: number;
}

class ReversePayrollDto {
  @ApiProperty({ example: 'Erroneous tax deduction adjustment required for revised allowance policy' })
  @IsNotEmpty()
  @IsString()
  reason: string;
}

@ApiTags('Human Resources & Payroll')
@RequireModule(ModuleType.HR)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  // ----------------------------------------------------
  // OVERVIEW & EMPLOYEES
  // ----------------------------------------------------

  @Get('dashboard')
  @RequirePermissions('hr.employee.read')
  @ApiOperation({ summary: 'Get HR metrics, active headcount, and pending leave queue' })
  getDashboard() {
    return this.hrService.getHrDashboard();
  }

  @Get('employees')
  @RequirePermissions('hr.employee.read')
  @ApiOperation({ summary: 'List, paginate, and search college staff and faculty employees' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'status', enum: EmploymentStatus, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getEmployees(
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: EmploymentStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.hrService.getEmployees({
      search,
      departmentId,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('employees/:id')
  @RequirePermissions('hr.employee.read')
  @ApiOperation({ summary: 'Get employee profile, leave records, and monthly salary history' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  getEmployeeById(@Param('id') id: string) {
    return this.hrService.getEmployeeById(id);
  }

  @Post('employees')
  @RequirePermissions('hr.employee.manage')
  @Audited({ entity: 'Employee', action: 'CREATE' })
  @ApiOperation({ summary: 'Register a new employee with department, designation, and salary scale' })
  createEmployee(@Body() dto: CreateEmployeeDto, @CurrentUser() user: any) {
    return this.hrService.createEmployee(dto, user?.id);
  }

  // ----------------------------------------------------
  // LEAVE WORKFLOW
  // ----------------------------------------------------

  @Get('leaves')
  @RequirePermissions('hr.leave.read')
  @ApiOperation({ summary: 'List staff leave applications with status filter' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'status', enum: LeaveStatus, required: false })
  getLeaves(
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: LeaveStatus,
  ) {
    return this.hrService.getLeaves({ employeeId, status });
  }

  @Post('leaves')
  @RequirePermissions('hr.leave.read')
  @Audited({ entity: 'EmployeeLeave', action: 'CREATE' })
  @ApiOperation({ summary: 'Submit a new leave application (Casual, Sick, Annual, Maternity, Unpaid)' })
  applyLeave(@Body() dto: ApplyLeaveDto, @CurrentUser() user: any) {
    return this.hrService.applyLeave(dto, user?.id);
  }

  @Post('leaves/:id/decision')
  @RequirePermissions('hr.leave.manage')
  @Audited({ entity: 'EmployeeLeave', action: 'UPDATE' })
  @ApiOperation({ summary: 'Approve or reject employee leave application with notification' })
  @ApiParam({ name: 'id', description: 'Leave application UUID' })
  updateLeaveStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.hrService.updateLeaveStatus(id, dto.status, user?.id);
  }

  // ----------------------------------------------------
  // DETERMINISTIC PAYROLL ENGINE
  // ----------------------------------------------------

  @Get('payrolls')
  @RequirePermissions('hr.payroll.read')
  @ApiOperation({ summary: 'List monthly staff payroll records with calculation breakdown' })
  @ApiQuery({ name: 'month', required: false, example: 8 })
  @ApiQuery({ name: 'year', required: false, example: 2026 })
  @ApiQuery({ name: 'status', enum: PayrollStatus, required: false })
  getPayrolls(
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('status') status?: PayrollStatus,
  ) {
    return this.hrService.getPayrolls({ month, year, status });
  }

  @Post('payrolls/generate')
  @RequirePermissions('hr.payroll.process')
  @Idempotent({ ttlSeconds: 120 })
  @Audited({ entity: 'Payroll', action: 'CALCULATE' })
  @ApiOperation({ summary: 'Run deterministic payroll formula for active employees: basic + allowances + bonuses - tax - unpaid leaves' })
  generatePayroll(@Body() dto: ProcessPayrollDto, @CurrentUser() user: any) {
    return this.hrService.generateMonthlyPayroll(dto, user?.id);
  }

  @Post('payrolls/:id/approve')
  @RequirePermissions('hr.payroll.approve')
  @Audited({ entity: 'Payroll', action: 'APPROVE' })
  @ApiOperation({ summary: 'Approve calculated payroll period (locks record from automatic modification)' })
  @ApiParam({ name: 'id', description: 'Payroll UUID' })
  approvePayroll(@Param('id') id: string, @CurrentUser() user: any) {
    return this.hrService.approvePayroll(id, user?.id);
  }

  @Post('payrolls/:id/disburse')
  @RequirePermissions('hr.payroll.approve')
  @Audited({ entity: 'Payroll', action: 'DISBURSE' })
  @ApiOperation({ summary: 'Mark approved salary slip as disbursed / PAID' })
  @ApiParam({ name: 'id', description: 'Payroll UUID' })
  markPaid(@Param('id') id: string, @CurrentUser() user: any) {
    return this.hrService.markPayrollPaid(id, user?.id);
  }

  @Post('payrolls/:id/reverse')
  @RequirePermissions('hr.payroll.reverse')
  @Audited({ entity: 'Payroll', action: 'REVERSE' })
  @ApiOperation({ summary: 'Reverse finalized payroll with mandatory reason and compensating audit trail' })
  @ApiParam({ name: 'id', description: 'Payroll UUID' })
  reversePayroll(
    @Param('id') id: string,
    @Body() dto: ReversePayrollDto,
    @CurrentUser() user: any,
  ) {
    return this.hrService.reversePayroll(id, dto.reason, user?.id);
  }
}

