import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ModuleType } from '@prisma/client';

export class ToggleModuleDto {
  @ApiProperty({ enum: ModuleType, example: ModuleType.HOSPITAL })
  @IsEnum(ModuleType)
  module: ModuleType;

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean;

  @ApiPropertyOptional({ example: { bedsAvailable: 120, emergencyEnabled: true } })
  @IsOptional()
  settings?: Record<string, any>;
}
