import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';

@ApiTags('College Settings & Profile')
@Controller('college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Get()
  @ApiOperation({ summary: 'Get current college profile, settings, and active modules' })
  @ApiResponse({ status: 200, description: 'College profile returned successfully' })
  getProfile() {
    return this.collegeService.getProfile();
  }

  @Post()
  @ApiOperation({ summary: 'Initialize or update college instance profile' })
  @ApiResponse({ status: 201, description: 'College successfully initialized' })
  create(@Body() dto: CreateCollegeDto) {
    return this.collegeService.create(dto);
  }
}
