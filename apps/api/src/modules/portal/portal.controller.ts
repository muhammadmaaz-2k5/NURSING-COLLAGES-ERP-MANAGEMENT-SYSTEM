import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PortalService } from './portal.service';

@ApiTags('Public Portal, Announcements & Certificates')
@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get('notices')
  @ApiOperation({ summary: 'List published academic notices and announcements' })
  getNotices() {
    return this.portalService.getNotices();
  }

  @Get('events')
  @ApiOperation({ summary: 'List upcoming campus seminars, workshops, and clinical events' })
  getEvents() {
    return this.portalService.getEvents();
  }

  @Get('news')
  @ApiOperation({ summary: 'List college news articles' })
  getNews() {
    return this.portalService.getNews();
  }

  @Get('certificates/verify/:certificateNo')
  @ApiOperation({ summary: 'Public endpoint to verify authenticity of student certificates' })
  @ApiParam({ name: 'certificateNo', description: 'Unique certificate serial identifier' })
  verifyCertificate(@Param('certificateNo') certificateNo: string) {
    return this.portalService.verifyCertificate(certificateNo);
  }
}
