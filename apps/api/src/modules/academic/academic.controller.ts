import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AcademicService } from './academic.service';

@ApiTags('Academic Management')
@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Get('departments')
  @ApiOperation({ summary: 'List all academic departments' })
  @ApiResponse({ status: 200, description: 'Departments retrieved' })
  getDepartments() {
    return this.academicService.getDepartments();
  }

  @Get('programs')
  @ApiOperation({ summary: 'List all academic programs' })
  @ApiResponse({ status: 200, description: 'Programs retrieved' })
  getPrograms() {
    return this.academicService.getPrograms();
  }

  @Get('sessions')
  @ApiOperation({ summary: 'List all academic sessions and semesters' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved' })
  getSessions() {
    return this.academicService.getSessions();
  }
}
