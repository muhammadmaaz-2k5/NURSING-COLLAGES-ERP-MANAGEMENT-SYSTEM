import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCollegeDto {
  @ApiProperty({ example: 'National Medical & Healthcare College' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'NMC-01' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'national-medical-college' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Premier Healthcare & Clinical Nursing Institute' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'admissions@nmc.edu.pk' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+92-51-111-222-333' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Islamabad' })
  @IsOptional()
  @IsString()
  city?: string;
}
