import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { EmploymentStatus, LeaveStatus, ModuleType } from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';

@ApiTags('Human Resources & Payroll')
@RequireModule(ModuleType.HR)
@UseGuards(ModuleEnabledGuard)
@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('employees')
  @ApiOperation({ summary: 'List college employees and administrative staff' })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'status', enum: EmploymentStatus, required: false })
  getEmployees(
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: EmploymentStatus,
  ) {
    return this.hrService.getEmployees(departmentId, status);
  }

  @Get('leaves')
  @ApiOperation({ summary: 'List staff leave applications' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'status', enum: LeaveStatus, required: false })
  getLeaves(
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: LeaveStatus,
  ) {
    return this.hrService.getLeaves(employeeId, status);
  }

  @Get('payrolls')
  @ApiOperation({ summary: 'List monthly staff payroll records' })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'year', required: false })
  getPayrolls(@Query('month') month?: number, @Query('year') year?: number) {
    return this.hrService.getPayrolls(month ? Number(month) : undefined, year ? Number(year) : undefined);
  }
}
