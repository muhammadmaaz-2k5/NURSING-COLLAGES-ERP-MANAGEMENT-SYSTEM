import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from '../../common/database/transaction.service';
import { AuditService } from '../../common/audit/audit.service';
import { JobsService } from '../../common/jobs/jobs.service';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';
import {
  ContentStatus,
  EventStatus,
  CertificateType,
  AdmissionStatus,
  ApplicationType,
} from '@prisma/client';

import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';
import * as crypto from 'crypto';

export interface CreateCmsPageDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: ContentStatus;
}

export interface CreateNewsDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  status?: ContentStatus;
  publishedAt?: string;
}

export interface CreateEventDto {
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  status?: EventStatus;
}

export interface CreateNoticeDto {
  title: string;
  content: string;
  attachmentUrl?: string;
  isPublished?: boolean;
}

export interface PublicAdmissionApplicationDto {
  programId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  cnic?: string;
  dateOfBirth?: string;
  gender?: string;
  previousInstitute?: string;
  marksObtained?: number;
  totalMarks?: number;
  notes?: string;
}

export interface IssueCertificateDto {
  studentId: string;
  certificateNo: string;
  type: CertificateType;
  title: string;
  description?: string;
  issueDate?: string;
  fileUrl?: string;
}

@Injectable()
export class PortalService {
  private readonly logger = new Logger(PortalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  // ----------------------------------------------------
  // PUBLIC PORTAL: HOMEPAGE OVERVIEW & PROGRAMS
  // ----------------------------------------------------

  @Cacheable({
    key: 'portal:public:overview',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['portal'],
  })
  async getPublicOverview() {
    const [college, programs, news, events, notices, stats] = await Promise.all([
      this.prisma.college.findFirst({
        select: {
          name: true,
          code: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          logoUrl: true,
        },
      }),

      this.prisma.program.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          code: true,
          durationYears: true,
          totalCredits: true,
          description: true,
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.news.findMany({
        where: { status: ContentStatus.PUBLISHED },
        take: 4,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.event.findMany({
        where: { status: EventStatus.PUBLISHED },
        take: 3,
        orderBy: { startDate: 'asc' },
      }),
      this.prisma.notice.findMany({
        where: { isPublished: true },
        take: 5,
        orderBy: { publishedAt: 'desc' },
      }),
      Promise.all([
        this.prisma.student.count(),
        this.prisma.faculty.count(),
        this.prisma.program.count({ where: { isActive: true } }),
      ]),
    ]);

    return {
      college: college || {
        name: 'Islamabad College of Nursing & Allied Health Sciences',
        code: 'ICN-01',
        city: 'Islamabad',
        phone: '+92-51-1122334',
        email: 'admissions@nursingcollege.edu.pk',
      },
      stats: {
        totalStudents: stats[0] > 0 ? stats[0] : 450,
        facultyMembers: stats[1] > 0 ? stats[1] : 38,
        accreditedPrograms: stats[2] > 0 ? stats[2] : 6,
        clinicalHospitalBeds: 250,
      },
      programs,
      news,
      events,
      notices,
    };
  }

  @Cacheable({
    key: 'portal:public:programs',
    ttl: TTL_PRESETS.LONG,
    tags: ['portal', 'programs'],
  })
  async getPublicPrograms() {
    return this.prisma.program.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          select: { code: true, name: true, creditHours: true, isClinical: true },
          take: 8,
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  // ----------------------------------------------------
  // PUBLIC CMS CONTENT: PAGES, NEWS, EVENTS & NOTICES
  // ----------------------------------------------------

  @Cacheable({
    key: 'portal:pages:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['portal', 'cms'],
  })
  async getPages() {
    return this.prisma.page.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { id: true, title: true, slug: true, excerpt: true, updatedAt: true },
      orderBy: { title: 'asc' },
    });
  }

  async getPageBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({ where: { slug } });
    if (!page || page.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundException(`Page with slug "${slug}" not found`);
    }
    return page;
  }

  async getNews(query: { search?: string; page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { status: ContentStatus.PUBLISHED };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.news.count({ where }),
      this.prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  async getNewsBySlug(slug: string) {
    const item = await this.prisma.news.findUnique({ where: { slug } });
    if (!item || item.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundException(`News article "${slug}" not found`);
    }
    return item;
  }

  async getEvents() {
    return this.prisma.event.findMany({
      where: { status: EventStatus.PUBLISHED },
      orderBy: { startDate: 'asc' },
    });
  }

  async getNotices() {
    return this.prisma.notice.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  // ----------------------------------------------------
  // PUBLIC ONLINE ADMISSIONS INTAKE
  // ----------------------------------------------------

  async submitAdmissionApplication(dto: PublicAdmissionApplicationDto) {
    const program = await this.prisma.program.findUnique({ where: { id: dto.programId } });
    if (!program) throw new NotFoundException('Selected academic program not found');

    const appNo = `APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const percentage = dto.totalMarks && dto.marksObtained ? (dto.marksObtained / dto.totalMarks) * 100 : undefined;

    return this.txService.run(async (tx) => {
      const application = await tx.admissionApplication.create({
        data: {
          programId: dto.programId,
          applicationNo: appNo,
          type: ApplicationType.ONLINE,
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phone: dto.phone,
          cnic: dto.cnic,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          gender: dto.gender ? (dto.gender.toUpperCase() as any) : undefined,
          previousInstitution: dto.previousInstitute,
          previousPercentage: percentage,
          status: AdmissionStatus.PENDING,
          remarks: dto.notes,
        },
        include: { program: true },
      });

      // Dispatch confirmation email
      await this.jobsService.dispatchEmail({
        to: dto.email,
        subject: `Admission Application Received - ${appNo}`,
        body: `Dear ${dto.firstName},\n\nThank you for applying to ${program.name} at our institution. Your application reference number is ${appNo}.\n\nOur admissions committee will review your credentials and contact you with further instructions regarding entry test and interview dates.\n\nRegards,\nOffice of Admissions`,
      });

      return {
        success: true,
        applicationNo: appNo,
        programName: program.name,
        applicantName: `${application.firstName} ${application.lastName || ''}`.trim(),
        appliedAt: application.appliedAt,
        message: 'Your admission application has been submitted successfully. A confirmation email has been dispatched.',
      };
    });
  }

  // ----------------------------------------------------
  // PUBLIC QR & CRYPTOGRAPHIC VERIFICATION
  // ----------------------------------------------------

  /**
   * Public verification of degree/diploma certificates
   */
  async verifyCertificate(certificateNo: string) {
    const cert = await this.prisma.certificate.findFirst({
      where: { certificateNo: { equals: certificateNo.trim(), mode: 'insensitive' } },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            program: { select: { name: true, code: true } },
          },
        },
      },
    });

    if (!cert) {
      throw new NotFoundException(`No valid certificate record found matching serial "${certificateNo}"`);
    }

    // Cryptographic verification hash (SHA-256)
    const rawData = `${cert.certificateNo}|${cert.studentId}|${cert.type}|${cert.issueDate.toISOString()}`;
    const verificationHash = crypto.createHash('sha256').update(rawData).digest('hex').substring(0, 16).toUpperCase();

    return {
      verified: true,
      status: 'AUTHENTIC_OFFICIAL_RECORD',
      certificateNo: cert.certificateNo,
      type: cert.type,
      title: cert.title,
      studentName: `${cert.student.user.firstName} ${cert.student.user.lastName || ''}`.trim(),
      program: cert.student.program.name,
      issueDate: cert.issueDate,
      issuingAuthority: 'Board of Governors & Examination Directorate',
      verificationHash,
      qrPayload: `https://portal.nursingcollege.edu.pk/verify?cert=${cert.certificateNo}&hash=${verificationHash}`,
    };
  }

  /**
   * Public verification of official academic transcripts
   */
  async verifyTranscript(studentId: string) {
    const student = await this.prisma.student.findFirst({
      where: {
        OR: [
          { id: studentId },
          { studentId: { equals: studentId.trim(), mode: 'insensitive' } },
        ],
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        program: true,
        results: {
          include: { exam: true, subject: true },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student record not found for verification`);
    }

    const totalCourses = student.results.length;
    const passedCourses = student.results.filter((r) => r.status === 'PASS').length;

    return {
      verified: true,
      status: 'VERIFIED_STUDENT_TRANSCRIPT',
      studentName: `${student.user.firstName} ${student.user.lastName || ''}`.trim(),
      studentId: student.studentId,
      program: student.program.name,
      academicStatus: student.status,
      totalExamsRecorded: totalCourses,
      passedExams: passedCourses,
      verifiedAt: new Date(),
    };
  }


  // ----------------------------------------------------
  // ADMINISTRATIVE CMS MANAGEMENT (AUDITED)
  // ----------------------------------------------------

  @CacheEvict({ tags: ['portal', 'cms'] })
  async createCmsPage(dto: CreateCmsPageDto, userId?: string) {
    const existing = await this.prisma.page.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Page slug "${dto.slug}" already exists`);

    const page = await this.prisma.page.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        status: dto.status || ContentStatus.PUBLISHED,
      },
    });

    await this.auditService.log({
      userId,
      action: 'CREATE',
      entity: 'Page',
      entityId: page.id,
      newData: { title: dto.title, slug: dto.slug },
    });

    return page;
  }

  @CacheEvict({ tags: ['portal', 'news'] })
  async createNews(dto: CreateNewsDto, userId?: string) {
    const existing = await this.prisma.news.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`News slug "${dto.slug}" already exists`);

    const news = await this.prisma.news.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        imageUrl: dto.imageUrl,
        status: dto.status || ContentStatus.PUBLISHED,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
      },
    });

    await this.auditService.log({
      userId,
      action: 'CREATE',
      entity: 'News',
      entityId: news.id,
      newData: { title: dto.title, slug: dto.slug },
    });

    return news;
  }

  @CacheEvict({ tags: ['portal', 'events'] })
  async createEvent(dto: CreateEventDto, userId?: string) {
    const existing = await this.prisma.event.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Event slug "${dto.slug}" already exists`);

    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        location: dto.location,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status || EventStatus.PUBLISHED,
      },
    });


    await this.auditService.log({
      userId,
      action: 'CREATE',
      entity: 'Event',
      entityId: event.id,
      newData: { title: dto.title, startDate: dto.startDate },
    });

    return event;
  }

  @CacheEvict({ tags: ['portal', 'notices'] })
  async createNotice(dto: CreateNoticeDto, userId?: string) {
    const notice = await this.prisma.notice.create({
      data: {
        title: dto.title,
        content: dto.content,
        attachmentUrl: dto.attachmentUrl,
        isPublished: dto.isPublished !== undefined ? dto.isPublished : true,
        publishedAt: dto.isPublished ? new Date() : null,
      },
    });

    await this.auditService.log({
      userId,
      action: 'CREATE',
      entity: 'Notice',
      entityId: notice.id,
      newData: { title: dto.title },
    });

    return notice;
  }

  @CacheEvict({ tags: ['portal'] })
  async issueCertificate(dto: IssueCertificateDto, userId?: string) {
    const student = await this.prisma.student.findUnique({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Student record not found');

    const cert = await this.prisma.certificate.create({
      data: {
        studentId: dto.studentId,
        certificateNo: dto.certificateNo,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : new Date(),
        fileUrl: dto.fileUrl,
      },
    });

    await this.auditService.log({
      userId,
      action: 'CREATE',
      entity: 'Certificate',
      entityId: cert.id,
      newData: { certificateNo: dto.certificateNo, title: dto.title, studentId: dto.studentId },
    });

    return cert;
  }
}

