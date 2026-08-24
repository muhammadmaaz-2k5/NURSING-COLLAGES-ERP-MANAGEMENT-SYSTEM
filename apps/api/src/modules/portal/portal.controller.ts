import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiProperty,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PortalService } from './portal.service';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import {
  ModuleType,
  ContentStatus,
  EventStatus,
  CertificateType,
} from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';

class PublicAdmissionApplicationDto {
  @ApiProperty({ example: 'prog-cuid-123' })
  @IsNotEmpty()
  @IsString()
  programId: string;

  @ApiProperty({ example: 'Amina' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Bibi', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'amina.bibi@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+923001234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: '37405-1234567-8', required: false })
  @IsOptional()
  @IsString()
  cnic?: string;

  @ApiProperty({ example: '2004-05-15', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'Female', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 'Govt Girls Higher Secondary School', required: false })
  @IsOptional()
  @IsString()
  previousInstitute?: string;

  @ApiProperty({ example: 980, required: false })
  @IsOptional()
  @IsNumber()
  marksObtained?: number;

  @ApiProperty({ example: 1100, required: false })
  @IsOptional()
  @IsNumber()
  totalMarks?: number;

  @ApiProperty({ example: 'FSc Pre-Medical with 89.1%', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class CreateCmsPageDto {
  @ApiProperty({ example: 'About Our Institution' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'about-us' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Leading nursing and health sciences education in Islamabad', required: false })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ example: '<p>Our college was founded to train compassionate, clinical-grade nursing leaders...</p>' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ enum: ContentStatus, example: ContentStatus.PUBLISHED, required: false })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

class CreateNewsDto {
  @ApiProperty({ example: 'Annual Nursing Convocation & Gold Medal Ceremony 2026' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'annual-nursing-convocation-2026' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Over 120 graduate nurses awarded degrees and PNC licensure pins', required: false })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ example: '<p>The ceremony was presided over by the Minister of National Health Services...</p>' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ enum: ContentStatus, example: ContentStatus.PUBLISHED, required: false })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

class CreateEventDto {
  @ApiProperty({ example: 'International Clinical Nursing Simulation Workshop' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'clinical-nursing-sim-workshop-2026' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Advanced High-Fidelity ICU simulation training for senior nursing interns', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Main Auditorium & Simulation Lab B', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '2026-09-25T09:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-09-26T17:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

class CreateNoticeDto {
  @ApiProperty({ example: 'Final Semester Examination Schedule - Fall 2026' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'All BSN and Post-RN students are hereby informed that the theoretical examinations...' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://storage.college.edu.pk/notices/datesheet-fall-2026.pdf', required: false })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

class IssueCertificateDto {
  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'CERT-2026-BSN-089' })
  @IsNotEmpty()
  @IsString()
  certificateNo: string;

  @ApiProperty({ enum: CertificateType, example: CertificateType.COURSE_COMPLETION })
  @IsEnum(CertificateType)
  type: CertificateType;


  @ApiProperty({ example: 'Bachelor of Science in Nursing (BSN Generic)' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Conferred with First Class Distinction and Clinical Excellence Award', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

@ApiTags('Public Portal, Announcements, CMS & Verification')
@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  // ----------------------------------------------------
  // PUBLIC PORTAL ENDPOINTS (OPEN ACCESS & RATE-LIMITED)
  // ----------------------------------------------------

  @Get('overview')
  @ApiOperation({ summary: 'Public endpoint: Get college public identity, accreditations, and featured items' })
  getPublicOverview() {
    return this.portalService.getPublicOverview();
  }

  @Get('programs')
  @ApiOperation({ summary: 'Public endpoint: List accredited nursing and allied health academic offerings' })
  getPrograms() {
    return this.portalService.getPublicPrograms();
  }

  @Get('pages')
  @ApiOperation({ summary: 'Public endpoint: List published institutional CMS pages' })
  getPages() {
    return this.portalService.getPages();
  }

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Public endpoint: View CMS page content by slug (e.g. about-us, principal-message)' })
  @ApiParam({ name: 'slug', example: 'about-us' })
  getPageBySlug(@Param('slug') slug: string) {
    return this.portalService.getPageBySlug(slug);
  }

  @Get('news')
  @ApiOperation({ summary: 'Public endpoint: List published college news articles and press releases' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getNews(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.portalService.getNews({ search, page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined });
  }

  @Get('news/:slug')
  @ApiOperation({ summary: 'Public endpoint: Get full article details by slug' })
  @ApiParam({ name: 'slug', description: 'News slug' })
  getNewsBySlug(@Param('slug') slug: string) {
    return this.portalService.getNewsBySlug(slug);
  }

  @Get('events')
  @ApiOperation({ summary: 'Public endpoint: List upcoming campus seminars, workshops, and clinical events' })
  getEvents() {
    return this.portalService.getEvents();
  }

  @Get('notices')
  @ApiOperation({ summary: 'Public endpoint: List official circulars, exam schedules, and public notices' })
  getNotices() {
    return this.portalService.getNotices();
  }

  @Post('admissions/apply')
  @ApiOperation({ summary: 'Public endpoint: Submit online student admission application intake' })
  applyOnline(@Body() dto: PublicAdmissionApplicationDto) {
    return this.portalService.submitAdmissionApplication(dto);
  }

  @Get('verify/certificate/:certificateNo')
  @ApiOperation({ summary: 'Public endpoint: Tamper-evident, QR-verifiable certificate authentication' })
  @ApiParam({ name: 'certificateNo', description: 'Unique certificate serial code' })
  verifyCertificate(@Param('certificateNo') certificateNo: string) {
    return this.portalService.verifyCertificate(certificateNo);
  }

  @Get('verify/transcript/:studentId')
  @ApiOperation({ summary: 'Public endpoint: Verify official academic transcript and examination results' })
  @ApiParam({ name: 'studentId', description: 'Student Roll Number or UUID' })
  verifyTranscript(@Param('studentId') studentId: string) {
    return this.portalService.verifyTranscript(studentId);
  }

  // ----------------------------------------------------
  // ADMINISTRATIVE CMS MANAGEMENT (PROTECTED & AUDITED)
  // ----------------------------------------------------

  @Post('cms/pages')
  @RequireModule(ModuleType.WEBSITE)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
  @ApiBearerAuth()
  @RequirePermissions('cms.manage')
  @Audited({ entity: 'Page', action: 'CREATE' })
  @ApiOperation({ summary: 'Admin: Create a CMS page' })
  createCmsPage(@Body() dto: CreateCmsPageDto, @CurrentUser() user: any) {
    return this.portalService.createCmsPage(dto, user?.id);
  }

  @Post('cms/news')
  @RequireModule(ModuleType.WEBSITE)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
  @ApiBearerAuth()
  @RequirePermissions('cms.manage')
  @Audited({ entity: 'News', action: 'CREATE' })
  @ApiOperation({ summary: 'Admin: Publish a news article or press release' })
  createNews(@Body() dto: CreateNewsDto, @CurrentUser() user: any) {
    return this.portalService.createNews(dto, user?.id);
  }

  @Post('cms/events')
  @RequireModule(ModuleType.WEBSITE)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
  @ApiBearerAuth()
  @RequirePermissions('cms.manage')
  @Audited({ entity: 'Event', action: 'CREATE' })
  @ApiOperation({ summary: 'Admin: Schedule a campus or clinical event' })
  createEvent(@Body() dto: CreateEventDto, @CurrentUser() user: any) {
    return this.portalService.createEvent(dto, user?.id);
  }

  @Post('cms/notices')
  @RequireModule(ModuleType.WEBSITE)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
  @ApiBearerAuth()
  @RequirePermissions('cms.manage')
  @Audited({ entity: 'Notice', action: 'CREATE' })
  @ApiOperation({ summary: 'Admin: Publish an official notice or circular' })
  createNotice(@Body() dto: CreateNoticeDto, @CurrentUser() user: any) {
    return this.portalService.createNotice(dto, user?.id);
  }

  @Post('cms/certificates')
  @RequireModule(ModuleType.WEBSITE)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
  @ApiBearerAuth()
  @RequirePermissions('cms.manage')
  @Audited({ entity: 'Certificate', action: 'CREATE' })
  @ApiOperation({ summary: 'Admin: Issue a verifiable student degree or diploma certificate' })
  issueCertificate(@Body() dto: IssueCertificateDto, @CurrentUser() user: any) {
    return this.portalService.issueCertificate(dto, user?.id);
  }
}

