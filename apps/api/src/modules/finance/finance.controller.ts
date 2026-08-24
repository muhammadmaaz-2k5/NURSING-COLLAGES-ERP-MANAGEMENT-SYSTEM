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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { Idempotent } from '../../common/database/idempotency.decorator';
import { FeeType, PaymentStatus, PaymentMethod, ScholarshipType } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

class CreateFeeStructureRequestDto {
  @ApiProperty({ example: 'program-cuid-123' })
  @IsNotEmpty()
  @IsString()
  programId: string;

  @ApiProperty({ example: 'semester-cuid-123', required: false })
  @IsOptional()
  @IsString()
  semesterId?: string;

  @ApiProperty({ example: 'BSN Year 1 Semester 1 Tuition Fee' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Comprehensive theory and practical laboratory fee', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 85000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: FeeType, example: FeeType.TUITION })
  @IsEnum(FeeType)
  feeType: FeeType;

  @ApiProperty({ example: '2026-09-10', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

class GenerateInvoiceRequestDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'fee-structure-cuid-123' })
  @IsNotEmpty()
  @IsString()
  feeStructureId: string;

  @ApiProperty({ example: 85000, required: false })
  @IsOptional()
  @IsNumber()
  customAmount?: number;

  @ApiProperty({ example: '2026-09-10', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 'Fall 2026 Semester 1 Fee Challan', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class RecordPaymentRequestDto {
  @ApiProperty({ example: 'invoice-cuid-123' })
  @IsNotEmpty()
  @IsString()
  invoiceId: string;

  @ApiProperty({ example: 85000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.BANK_TRANSFER })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 'HBL-FT-9988776655', required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({ example: 'Online banking bank receipt uploaded', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class ReversePaymentRequestDto {
  @ApiProperty({ example: 'Erroneous duplicate transfer adjustment' })
  @IsNotEmpty()
  @IsString()
  reason: string;
}

class CreateScholarshipRequestDto {
  @ApiProperty({ example: 'PNC Nursing Merit Excellence Scholarship' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '50% tuition concession for top 3 rank holders', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ScholarshipType, example: ScholarshipType.MERIT })
  @IsEnum(ScholarshipType)
  type: ScholarshipType;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  percentage?: number;

  @ApiProperty({ example: 40000, required: false })
  @IsOptional()
  @IsNumber()
  fixedAmount?: number;
}

class AssignScholarshipRequestDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'scholarship-cuid-123' })
  @IsNotEmpty()
  @IsString()
  scholarshipId: string;

  @ApiProperty({ example: 40000, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: '2026-09-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2027-08-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@ApiTags('Fees, Invoices & Financial Ledger')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ----------------------------------------------------
  // FEE STRUCTURES
  // ----------------------------------------------------

  @Get('structures')
  @RequirePermissions('fee.structure.read')
  @ApiOperation({ summary: 'List program fee structures and institutional tariff' })
  @ApiQuery({ name: 'programId', required: false })
  @ApiQuery({ name: 'semesterId', required: false })
  @ApiQuery({ name: 'feeType', enum: FeeType, required: false })
  @ApiQuery({ name: 'isActive', required: false })
  getFeeStructures(
    @Query('programId') programId?: string,
    @Query('semesterId') semesterId?: string,
    @Query('feeType') feeType?: FeeType,
    @Query('isActive') isActive?: string,
  ) {
    return this.financeService.getFeeStructures({
      programId,
      semesterId,
      feeType,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
  }

  @Post('structures')
  @RequirePermissions('fee.structure.manage')
  @Audited({ entity: 'FeeStructure', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a program or semester fee structure' })
  createFeeStructure(@Body() dto: CreateFeeStructureRequestDto) {
    return this.financeService.createFeeStructure(dto);
  }

  // ----------------------------------------------------
  // INVOICES & CHALLANS
  // ----------------------------------------------------

  @Get('invoices')
  @RequirePermissions('invoice.read')
  @ApiOperation({ summary: 'List and filter student fee challans and invoice records' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'status', enum: PaymentStatus, required: false })
  @ApiQuery({ name: 'feeStructureId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getInvoices(
    @Query('studentId') studentId?: string,
    @Query('status') status?: PaymentStatus,
    @Query('feeStructureId') feeStructureId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.financeService.getInvoices({
      studentId,
      status,
      feeStructureId,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post('invoices')
  @RequirePermissions('invoice.create')
  @Audited({ entity: 'PaymentInvoice', action: 'CREATE' })
  @ApiOperation({ summary: 'Generate a student fee challan with automatic scholarship deduction' })
  generateInvoice(@Body() dto: GenerateInvoiceRequestDto, @CurrentUser() user: any) {
    return this.financeService.generateInvoice(dto, user.id);
  }

  // ----------------------------------------------------
  // PAYMENTS & REVERSALS
  // ----------------------------------------------------

  @Post('payments')
  @RequirePermissions('payment.create')
  @Idempotent({ ttlSeconds: 120 })
  @Audited({ entity: 'Payment', action: 'CREATE' })
  @ApiOperation({ summary: 'Atomically record a payment against an invoice (Idempotency protected)' })
  recordPayment(@Body() dto: RecordPaymentRequestDto, @CurrentUser() user: any) {
    return this.financeService.recordPayment(dto, user.id);
  }

  @Post('invoices/:id/reverse')
  @RequirePermissions('payment.reverse')
  @Audited({ entity: 'Payment', action: 'REVOKE' })
  @ApiOperation({ summary: 'Reverse/refund recorded payment with compensating audit record' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  reversePayment(
    @Param('id') id: string,
    @Body() dto: ReversePaymentRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.financeService.reversePayment(id, dto.reason, user.id);
  }

  // ----------------------------------------------------
  // SCHOLARSHIPS
  // ----------------------------------------------------

  @Get('scholarships')
  @RequirePermissions('scholarship.read')
  @ApiOperation({ summary: 'List institutional scholarships and concessions' })
  getScholarships() {
    return this.financeService.getScholarships();
  }

  @Post('scholarships')
  @RequirePermissions('scholarship.manage')
  @Audited({ entity: 'Scholarship', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a merit or need-based scholarship scheme' })
  createScholarship(@Body() dto: CreateScholarshipRequestDto) {
    return this.financeService.createScholarship(dto);
  }

  @Post('scholarships/assign')
  @RequirePermissions('scholarship.manage')
  @Audited({ entity: 'StudentScholarship', action: 'CREATE' })
  @ApiOperation({ summary: 'Award scholarship to student' })
  assignScholarship(@Body() dto: AssignScholarshipRequestDto, @CurrentUser() user: any) {
    return this.financeService.assignScholarship(dto, user.id);
  }

  // ----------------------------------------------------
  // FINANCIAL LEDGER & REPORTS
  // ----------------------------------------------------

  @Get('students/:studentId/statement')
  @RequirePermissions('payment.read')
  @ApiOperation({ summary: 'Get full running financial ledger statement for a student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  getStudentLedger(@Param('studentId') studentId: string) {
    return this.financeService.getStudentLedgerStatement(studentId);
  }

  @Get('reports/summary')
  @RequirePermissions('finance.report.read')
  @ApiOperation({ summary: 'Get institutional financial summary and revenue recovery rate' })
  getSummary() {
    return this.financeService.getFinancialSummary();
  }
}
