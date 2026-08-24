import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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
import { PharmacyService } from './pharmacy.service';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ModuleType, MedicineMovementType } from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { Idempotent } from '../../common/database/idempotency.decorator';

class CreateMedicineDto {
  @ApiProperty({ example: 'Amoxicillin 500mg' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Amoxicillin Trihydrate', required: false })
  @IsOptional()
  @IsString()
  genericName?: string;

  @ApiProperty({ example: 'Antibiotics', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: '500mg', required: false })
  @IsOptional()
  @IsString()
  strength?: string;

  @ApiProperty({ example: 'Capsule', required: false })
  @IsOptional()
  @IsString()
  dosageForm?: string;

  @ApiProperty({ example: 'GSK Pharmaceuticals', required: false })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({ example: 'Strip of 10', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsNumber()
  reorderLevel?: number;

  @ApiProperty({ example: 120.0, required: false })
  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @ApiProperty({ example: 150.0, required: false })
  @IsOptional()
  @IsNumber()
  sellingPrice?: number;
}

class AddStockBatchDto {
  @ApiProperty({ example: 'med-cuid-123' })
  @IsNotEmpty()
  @IsString()
  medicineId: string;

  @ApiProperty({ example: 'BAT-2026-X89' })
  @IsNotEmpty()
  @IsString()
  batchNumber: string;

  @ApiProperty({ example: 200 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: '2028-06-30' })
  @IsNotEmpty()
  @IsDateString()
  expiryDate: string;

  @ApiProperty({ example: 120.0 })
  @IsNumber()
  purchasePrice: number;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  sellingPrice: number;

  @ApiProperty({ example: 'PO-2026-0044 delivered by supplier', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class StockAdjustmentDto {
  @ApiProperty({ example: 'med-cuid-123' })
  @IsNotEmpty()
  @IsString()
  medicineId: string;

  @ApiProperty({ example: 'batch-cuid-123', required: false })
  @IsOptional()
  @IsString()
  batchId?: string;

  @ApiProperty({ enum: MedicineMovementType, example: MedicineMovementType.ADJUSTMENT_IN })
  @IsEnum(MedicineMovementType)
  type: MedicineMovementType;

  @ApiProperty({ example: 10 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'REF-AUDIT-2026', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ example: 'Physical stock verification discrepancy', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class DispenseItemDto {
  @ApiProperty({ example: 'med-cuid-123' })
  @IsNotEmpty()
  @IsString()
  medicineId: string;

  @ApiProperty({ example: 'batch-cuid-123', required: false })
  @IsOptional()
  @IsString()
  batchId?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 150.0, required: false })
  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}

class DispensePrescriptionDto {
  @ApiProperty({ example: 'patient-cuid-123', required: false })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ example: 'presc-cuid-123', required: false })
  @IsOptional()
  @IsString()
  prescriptionId?: string;

  @ApiProperty({ type: [DispenseItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DispenseItemDto)
  items: DispenseItemDto[];

  @ApiProperty({ example: 'Dispensed to patient attendant', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

@ApiTags('Pharmacy & Medicine Dispensary')
@RequireModule(ModuleType.PHARMACY)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  // ----------------------------------------------------
  // OVERVIEW & METRICS
  // ----------------------------------------------------

  @Get('overview')
  @RequirePermissions('pharmacy.read')
  @ApiOperation({ summary: 'Get pharmacy stock value, low-stock counter, and expiry warning counts' })
  getOverview() {
    return this.pharmacyService.getPharmacyOverview();
  }

  // ----------------------------------------------------
  // MEDICINE CATALOG
  // ----------------------------------------------------

  @Get('medicines')
  @RequirePermissions('pharmacy.read')
  @ApiOperation({ summary: 'List and search medicine catalog with active inventory batches' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getMedicines(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.pharmacyService.getMedicines({
      search,
      category,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('medicines/:id')
  @RequirePermissions('pharmacy.read')
  @ApiOperation({ summary: 'Get medicine stock details, batch breakdown, and movement history' })
  @ApiParam({ name: 'id', description: 'Medicine UUID' })
  getMedicineById(@Param('id') id: string) {
    return this.pharmacyService.getMedicineById(id);
  }

  @Post('medicines')
  @RequirePermissions('pharmacy.manage')
  @Audited({ entity: 'Medicine', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a new medicine formulation in catalog' })
  createMedicine(@Body() dto: CreateMedicineDto, @CurrentUser() user: any) {
    return this.pharmacyService.createMedicine(dto, user?.id);
  }

  // ----------------------------------------------------
  // STOCK RECEIPT & BATCHES
  // ----------------------------------------------------

  @Post('batches')
  @RequirePermissions('pharmacy.stock.manage')
  @Audited({ entity: 'MedicineBatch', action: 'CREATE' })
  @ApiOperation({ summary: 'Receive new stock shipment batch with expiry and unit pricing' })
  addStockBatch(@Body() dto: AddStockBatchDto, @CurrentUser() user: any) {
    return this.pharmacyService.addStockBatch(dto, user?.id);
  }

  // ----------------------------------------------------
  // TRANSACTIONAL DISPENSING
  // ----------------------------------------------------

  @Post('dispense')
  @RequirePermissions('pharmacy.dispense')
  @Idempotent({ ttlSeconds: 60 })
  @Audited({ entity: 'DispensingRecord', action: 'CREATE' })
  @ApiOperation({ summary: 'Atomically dispense medicines with strict stock availability validation and movement logs' })
  dispense(@Body() dto: DispensePrescriptionDto, @CurrentUser() user: any) {
    return this.pharmacyService.dispenseMedicines(dto, user?.id);
  }

  @Post('adjustments')
  @RequirePermissions('pharmacy.stock.manage')
  @Audited({ entity: 'MedicineStockMovement', action: 'CREATE' })
  @ApiOperation({ summary: 'Record manual stock adjustment (damaged, expired write-off, physical count correction)' })
  adjustStock(@Body() dto: StockAdjustmentDto, @CurrentUser() user: any) {
    return this.pharmacyService.adjustStock(dto, user?.id);
  }

  // ----------------------------------------------------
  // REPORTS
  // ----------------------------------------------------

  @Get('reports/low-stock')
  @RequirePermissions('pharmacy.report.read')
  @ApiOperation({ summary: 'Get list of medicines whose stock is below reorder thresholds' })
  getLowStock() {
    return this.pharmacyService.getLowStockMedicines();
  }

  @Get('reports/expiring')
  @RequirePermissions('pharmacy.report.read')
  @ApiOperation({ summary: 'Get batches expiring within next 60 days' })
  @ApiQuery({ name: 'daysAhead', required: false, example: 60 })
  getExpiring(@Query('daysAhead') daysAhead?: number) {
    return this.pharmacyService.getExpiringMedicines(daysAhead ? Number(daysAhead) : 60);
  }

  @Get('reports/expired')
  @RequirePermissions('pharmacy.report.read')
  @ApiOperation({ summary: 'Get expired batches requiring quarantine/write-off' })
  getExpired() {
    return this.pharmacyService.getExpiredMedicines();
  }

  @Get('movements')
  @RequirePermissions('pharmacy.report.read')
  @ApiOperation({ summary: 'Get stock movement ledger and dispensing audit log' })
  @ApiQuery({ name: 'medicineId', required: false })
  getMovements(@Query('medicineId') medicineId?: string) {
    return this.pharmacyService.getStockMovements(medicineId);
  }
}

