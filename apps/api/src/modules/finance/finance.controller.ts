import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { FeeType, PaymentStatus, PaymentMethod } from '@prisma/client';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

class CreateFeeStructureDto {
  @ApiProperty({ example: 'program-cuid-123' })
  @IsNotEmpty()
  @IsString()
  programId: string;

  @ApiProperty({ example: 'semester-cuid-123', required: false })
  @IsOptional()
  @IsString()
  semesterId?: string;

  @ApiProperty({ example: 'Semester 1 Tuition Fee' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Includes library and lab charges', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 85000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: FeeType, example: FeeType.TUITION })
  @IsEnum(FeeType)
  feeType: FeeType;
}

class RecordPaymentDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'fee-structure-cuid-123' })
  @IsNotEmpty()
  @IsString()
  feeStructureId: string;

  @ApiProperty({ example: 'INV-2026-0089' })
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;

  @ApiProperty({ example: 85000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 85000 })
  @IsNumber()
  paidAmount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.BANK_TRANSFER, required: false })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiProperty({ example: 'TXN-99881122', required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;
}

@ApiTags('Fees & Financial Management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('structures')
  @RequirePermissions('fee.structure.manage')
  @ApiOperation({ summary: 'List defined fee structures' })
  @ApiQuery({ name: 'programId', required: false })
  getFeeStructures(@Query('programId') programId?: string) {
    return this.financeService.getFeeStructures(programId);
  }

  @Get('payments')
  @RequirePermissions('payment.read')
  @ApiOperation({ summary: 'List student fee invoices and payment transactions' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'status', enum: PaymentStatus, required: false })
  getPayments(@Query('studentId') studentId?: string, @Query('status') status?: PaymentStatus) {
    return this.financeService.getPayments(studentId, status);
  }

  @Get('metrics')
  @RequirePermissions('payment.read')
  @ApiOperation({ summary: 'Get total revenue, pending invoices, and paid statistics' })
  getMetrics() {
    return this.financeService.getSummaryMetrics();
  }

  @Post('structures')
  @RequirePermissions('fee.structure.manage')
  @ApiOperation({ summary: 'Create a new fee structure' })
  createFeeStructure(@Body() dto: CreateFeeStructureDto) {
    return this.financeService.createFeeStructure(dto);
  }

  @Post('payments')
  @RequirePermissions('payment.create')
  @ApiOperation({ summary: 'Record a student fee payment' })
  recordPayment(@Body() dto: RecordPaymentDto) {
    return this.financeService.recordPayment(dto);
  }
}
