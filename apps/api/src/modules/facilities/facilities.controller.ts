import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { FacilitiesService } from './facilities.service';
import { IssueStatus, ModuleType } from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Campus Facilities - Hostels & Accommodations')
@RequireModule(ModuleType.HOSTEL)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('hostels')
export class HostelController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get()
  @RequirePermissions('facilities.hostel.manage')
  @ApiOperation({ summary: 'List hostel buildings, rooms, and bed allocations' })
  getHostels() {
    return this.facilitiesService.getHostels();
  }
}

@ApiTags('Campus Facilities - Library & Lending')
@RequireModule(ModuleType.LIBRARY)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('library')
export class LibraryController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get('books')
  @RequirePermissions('facilities.library.issue')
  @ApiOperation({ summary: 'Search and catalog library books' })
  @ApiQuery({ name: 'search', required: false })
  getLibraryBooks(@Query('search') search?: string) {
    return this.facilitiesService.getLibraryBooks(search);
  }

  @Get('issues')
  @RequirePermissions('facilities.library.issue')
  @ApiOperation({ summary: 'List borrowed library books and return dates' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'status', enum: IssueStatus, required: false })
  getLibraryIssues(@Query('studentId') studentId?: string, @Query('status') status?: IssueStatus) {
    return this.facilitiesService.getLibraryIssues(studentId, status);
  }
}

@ApiTags('Campus Facilities - Transport Fleet & Routes')
@RequireModule(ModuleType.TRANSPORT)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('transport')
export class TransportController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get('routes')
  @RequirePermissions('facilities.transport.manage')
  @ApiOperation({ summary: 'List transport routes, bus stops, and assigned vehicles' })
  getTransportRoutes() {
    return this.facilitiesService.getTransportRoutes();
  }
}
