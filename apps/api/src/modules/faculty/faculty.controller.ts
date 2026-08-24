import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FacultyService } from './faculty.service';

@ApiTags('Faculty & Instructors')
@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  @ApiOperation({ summary: 'List faculty members and instructors' })
  @ApiQuery({ name: 'departmentId', required: false })
  findAll(@Query('departmentId') departmentId?: string) {
    return this.facultyService.findAll(departmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get faculty member details, teaching workload, and supervisions' })
  @ApiParam({ name: 'id', description: 'Faculty UUID or Employee ID' })
  findOne(@Param('id') id: string) {
    return this.facultyService.findOne(id);
  }
}
