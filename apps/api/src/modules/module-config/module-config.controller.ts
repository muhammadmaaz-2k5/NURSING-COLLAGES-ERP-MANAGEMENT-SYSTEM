import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ModuleConfigService } from './module-config.service';
import { ToggleModuleDto } from './dto/toggle-module.dto';

@ApiTags('Module Configurations (SaaS Features)')
@Controller('modules')
export class ModuleConfigController {
  constructor(private readonly moduleConfigService: ModuleConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get status of all system modules for this college instance' })
  @ApiResponse({ status: 200, description: 'All modules with enabled status' })
  getModules() {
    return this.moduleConfigService.getModules();
  }

  @Put()
  @ApiOperation({ summary: 'Enable or disable a specific module for this college instance' })
  @ApiResponse({ status: 200, description: 'Module status updated successfully' })
  toggleModule(@Body() dto: ToggleModuleDto) {
    return this.moduleConfigService.toggleModule(dto);
  }
}
