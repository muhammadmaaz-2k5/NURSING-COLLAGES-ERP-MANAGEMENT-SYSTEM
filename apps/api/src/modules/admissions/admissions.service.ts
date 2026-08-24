import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from '../../common/database/transaction.service';
import { AuditService } from '../../common/audit/audit.service';
import { JobsService } from '../../common/jobs/jobs.service';
import { StorageService } from '../../common/storage/storage.service';
import {
  AdmissionStatus,
  ApplicationType,
  Gender,
  DocumentType,
  UserStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateAdmissionApplicationDto {
  programId: string;
  type?: ApplicationType;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: Gender;
  cnic?: string;
  address?: string;
  city?: string;
  previousQualification?: string;
  previousInstitution?: string;
  previousPercentage?: number;
}

export interface QueryApplicationsDto {
  status?: AdmissionStatus;
  programId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdmissionsService {
  private readonly logger = new Logger(AdmissionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Submit an online or walk-in admission application
   */
  async createApplication(dto: CreateAdmissionApplicationDto) {
    const program = await this.prisma.program.findUnique({ where: { id: dto.programId } });
    if (!program) throw new NotFoundException('Selected academic program not found');

    const year = new Date().getFullYear();
    const count = await this.prisma.admissionApplication.count();
    const applicationNo = `APP-${year}-${String(count + 1).padStart(4, '0')}`;

    const app = await this.prisma.admissionApplication.create({
      data: {
        programId: dto.programId,
        applicationNo,
        type: dto.type || ApplicationType.ONLINE,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        cnic: dto.cnic,
        address: dto.address,
        city: dto.city,
        previousQualification: dto.previousQualification,
        previousInstitution: dto.previousInstitution,
        previousPercentage: dto.previousPercentage,
        status: AdmissionStatus.PENDING,
      },
      include: { program: true },
    });

    // Dispatch confirmation email
    await this.jobsService.dispatchEmail({
      to: dto.email,
      subject: `Admission Application Received - ${applicationNo}`,
      body: `Dear ${dto.firstName},\n\nYour application for ${program.name} has been received with Application No: ${applicationNo}.\nOur admissions committee will review your documents shortly.`,
    });

    return app;
  }

  /**
   * Upload an application supporting document (CNIC, Matric, FSc, Domicile)
   */
  async uploadDocument(
    applicationId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    type: DocumentType,
  ) {
    const app = await this.prisma.admissionApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application not found');

    const savedFile = await this.storageService.saveFile(
      fileBuffer,
      originalName,
      mimeType,
      'admissions',
    );

    return this.prisma.admissionDocument.create({
      data: {
        applicationId,
        type,
        fileUrl: savedFile.url,
        fileName: originalName,
      },
    });
  }

  async findAll(query: QueryApplicationsDto): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.programId) where.programId = query.programId;
    if (query.search) {
      where.OR = [
        { applicationNo: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.admissionApplication.count({ where }),
      this.prisma.admissionApplication.findMany({
        where,
        include: {
          program: true,
          documents: true,
        },
        orderBy: { appliedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  async findOne(id: string) {
    const app = await this.prisma.admissionApplication.findFirst({
      where: { OR: [{ id }, { applicationNo: id }] },
      include: {
        program: { include: { department: true } },
        documents: true,
      },
    });

    if (!app) throw new NotFoundException(`Application "${id}" not found`);
    return app;
  }

  /**
   * Review application status (UNDER_REVIEW, APPROVED, REJECTED, WAITING_LIST)
   */
  async reviewApplication(
    id: string,
    status: AdmissionStatus,
    remarks?: string,
    reviewerId?: string,
  ) {
    const app = await this.prisma.admissionApplication.findUnique({
      where: { id },
      include: { program: true },
    });
    if (!app) throw new NotFoundException('Application not found');

    const updated = await this.prisma.admissionApplication.update({
      where: { id },
      data: { status, remarks },
      include: { program: true },
    });

    await this.auditService.log({
      userId: reviewerId,
      action: 'REVIEW',
      entity: 'AdmissionApplication',
      entityId: id,
      oldData: { status: app.status },
      newData: { status, remarks },
    });

    // Notify applicant
    await this.jobsService.dispatchEmail({
      to: app.email,
      subject: `Admission Application Status Update - ${app.applicationNo}`,
      body: `Dear ${app.firstName},\n\nYour application for ${app.program.name} has been updated to: ${status}.\nRemarks: ${remarks || 'None'}`,
    });

    return updated;
  }

  /**
   * Atomic Student Registration from Approved Admission Application
   */
  async enrollApplicant(
    id: string,
    data: { campusId?: string; temporaryPassword?: string },
    reviewerId?: string,
  ) {
    const app = await this.prisma.admissionApplication.findUnique({
      where: { id },
      include: { program: true, documents: true },
    });

    if (!app) throw new NotFoundException('Application not found');
    if (app.status === AdmissionStatus.ENROLLED) {
      throw new BadRequestException('Applicant is already enrolled as a student');
    }

    const year = new Date().getFullYear();
    const studentCount = await this.prisma.student.count();
    const studentId = `STD-${year}-${String(studentCount + 1).padStart(4, '0')}`;
    const rawPass = data.temporaryPassword || 'Student@123';
    const passwordHash = await bcrypt.hash(rawPass, 10);

    return this.txService.run(async (tx) => {
      // 1. Find or create User
      let user = await tx.user.findUnique({ where: { email: app.email } });
      if (!user) {
        user = await tx.user.create({
          data: {
            email: app.email,
            passwordHash,
            firstName: app.firstName,
            lastName: app.lastName,
            phone: app.phone,
            status: UserStatus.ACTIVE,
          },
        });
      }

      // 2. Assign STUDENT role
      const studentRole = await tx.role.findUnique({ where: { name: 'STUDENT' } });
      if (studentRole) {
        await tx.userRole.upsert({
          where: { userId_roleId: { userId: user.id, roleId: studentRole.id } },
          update: {},
          create: { userId: user.id, roleId: studentRole.id },
        });
      }

      // 3. Create Student record
      const student = await tx.student.create({
        data: {
          userId: user.id,
          programId: app.programId,
          campusId: data.campusId,
          studentId,
          admissionDate: new Date(),
          dateOfBirth: app.dateOfBirth,
          gender: app.gender,
          cnic: app.cnic,
          phone: app.phone,
          address: app.address,
          city: app.city,
        },
      });

      // 4. Migrate Application Documents to Student Documents
      for (const doc of app.documents) {
        await tx.studentDocument.create({
          data: {
            studentId: student.id,
            type: doc.type,
            fileUrl: doc.fileUrl,
            fileName: doc.fileName,
          },
        });
      }

      // 5. Update Application status to ENROLLED
      await tx.admissionApplication.update({
        where: { id: app.id },
        data: { status: AdmissionStatus.ENROLLED },
      });

      // 6. Record Audit Log
      await this.auditService.log({
        userId: reviewerId,
        action: 'ENROLL',
        entity: 'Student',
        entityId: student.id,
        newData: { studentId, programId: app.programId, userId: user.id },
      });

      // 7. Dispatch Welcome Email via background worker
      await this.jobsService.dispatchEmail({
        to: app.email,
        subject: `Welcome to ${app.program.name} - Registration No: ${studentId}`,
        body: `Dear ${app.firstName},\n\nCongratulations! Your enrollment is complete.\n\nYour Student ID: ${studentId}\nPortal Email: ${app.email}\nTemporary Password: ${rawPass}\n\nPlease log in and change your password.`,
      });

      return {
        success: true,
        studentId: student.studentId,
        userEmail: user.email,
        studentRecordId: student.id,
      };
    });
  }

  async getMetrics() {
    const total = await this.prisma.admissionApplication.count();
    const pending = await this.prisma.admissionApplication.count({ where: { status: AdmissionStatus.PENDING } });
    const approved = await this.prisma.admissionApplication.count({ where: { status: AdmissionStatus.APPROVED } });
    const enrolled = await this.prisma.admissionApplication.count({ where: { status: AdmissionStatus.ENROLLED } });
    const rejected = await this.prisma.admissionApplication.count({ where: { status: AdmissionStatus.REJECTED } });

    return { total, pending, approved, enrolled, rejected };
  }
}
