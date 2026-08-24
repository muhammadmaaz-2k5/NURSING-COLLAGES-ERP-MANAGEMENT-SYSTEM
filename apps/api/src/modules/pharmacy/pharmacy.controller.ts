import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiProperty } from '@nestjs/swagger';
import { PharmacyService } from './pharmacy.service';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ModuleType } from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';

class AddMedicineDto {
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

  @ApiProperty({ example: 'Capsules', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  reorderLevel?: number;
}

@ApiTags('Pharmacy & Medicine Dispensary')
@RequireModule(ModuleType.PHARMACY)
@UseGuards(ModuleEnabledGuard)
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('medicines')
  @ApiOperation({ summary: 'List and search medicines in pharmacy stock' })
  @ApiQuery({ name: 'search', required: false })
  getMedicines(@Query('search') search?: string) {
    return this.pharmacyService.getMedicines(search);
  }

  @Post('medicines')
  @ApiOperation({ summary: 'Add a new medicine stock item' })
  addMedicine(@Body() dto: AddMedicineDto) {
    return this.pharmacyService.addMedicine(dto);
  }
}
