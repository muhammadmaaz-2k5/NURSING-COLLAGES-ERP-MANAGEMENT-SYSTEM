import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from '../../common/database/transaction.service';
import { AuditService } from '../../common/audit/audit.service';
import { JobsService } from '../../common/jobs/jobs.service';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';
import {
  ClinicalSiteType,
  ClinicalStatus,
  SkillStatus,
} from '@prisma/client';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateClinicalSiteDto {
  name: string;
  type: ClinicalSiteType;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  isActive?: boolean;
}

export interface CreateRotationDto {
  studentId: string;
  siteId: string;
  facultyId?: string;
  department?: string;
  ward?: string;
  startDate: string;
  endDate: string;
  remarks?: string;
}

export interface CreateNursingSkillDto {
  name: string;
  description?: string;
  category?: string;
  subjectId?: string;
  isActive?: boolean;
}

export interface RecordSkillAttemptDto {
  studentId: string;
  skillId: string;
  remarks?: string;
}

export interface VerifySkillDto {
  score?: number;
  remarks?: string;
  status: SkillStatus;
}

@Injectable()
export class ClinicalService {
  private readonly logger = new Logger(ClinicalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  // ----------------------------------------------------
  // CLINICAL SITES
  // ----------------------------------------------------

  @Cacheable({
    key: 'clinical:sites:all',
    ttl: TTL_PRESETS.LONG,
    tags: ['clinical', 'sites'],
  })
  async getSites(type?: ClinicalSiteType, isActive?: boolean) {
    return this.prisma.clinicalSite.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      include: {
        _count: { select: { trainings: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({ tags: ['clinical', 'sites'] })
  async createSite(dto: CreateClinicalSiteDto) {
    return this.prisma.clinicalSite.create({
      data: {
        name: dto.name,
        type: dto.type,
        address: dto.address,
        city: dto.city,
        phone: dto.phone,
        email: dto.email,
        contactPerson: dto.contactPerson,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  @CacheEvict({ tags: ['clinical', 'sites'] })
  async updateSite(id: string, dto: Partial<CreateClinicalSiteDto>) {
    const site = await this.prisma.clinicalSite.findUnique({ where: { id } });
    if (!site) throw new NotFoundException('Clinical site not found');

    return this.prisma.clinicalSite.update({
      where: { id },
      data: dto,
    });
  }

  // ----------------------------------------------------
  // CLINICAL ROTATIONS & WARD ALLOCATIONS
  // ----------------------------------------------------

  async createRotation(dto: CreateRotationDto, assignerId?: string) {
    const [student, site] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: dto.studentId }, include: { user: true } }),
      this.prisma.clinicalSite.findUnique({ where: { id: dto.siteId } }),
    ]);

    if (!student) throw new NotFoundException('Student not found');
    if (!site) throw new NotFoundException('Clinical site not found');
    if (!site.isActive) throw new BadRequestException('Selected clinical site is currently inactive');

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (end < start) {
      throw new BadRequestException('Rotation end date cannot be before start date');
    }

    // Clash detection: prevent overlapping rotations for the same student
    const overlapping = await this.prisma.clinicalTraining.findFirst({
      where: {
        studentId: dto.studentId,
        status: { in: [ClinicalStatus.PLANNED, ClinicalStatus.ACTIVE] },
        OR: [
          { startDate: { lte: end }, endDate: { gte: start } },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictException(
        `Clinical clash: Student is already scheduled for rotation in ${overlapping.ward || 'clinical ward'} from ${overlapping.startDate.toLocaleDateString()} to ${overlapping.endDate.toLocaleDateString()}`,
      );
    }

    const rotation = await this.prisma.clinicalTraining.create({
      data: {
        studentId: dto.studentId,
        siteId: dto.siteId,
        facultyId: dto.facultyId,
        department: dto.department,
        ward: dto.ward,
        startDate: start,
        endDate: end,
        remarks: dto.remarks,
        status: ClinicalStatus.PLANNED,
      },
      include: {
        site: true,
        faculty: { include: { user: true } },
        student: { include: { user: true } },
      },
    });

    await this.auditService.log({
      userId: assignerId,
      action: 'ROTATION_ASSIGN',
      entity: 'ClinicalTraining',
      entityId: rotation.id,
      newData: { studentId: dto.studentId, siteName: site.name, ward: dto.ward },
    });

    // Notify student via BullMQ
    await this.jobsService.dispatchNotification({
      userId: student.userId,
      title: `Clinical Ward Rotation Assigned: ${site.name}`,
      message: `You have been posted to ${dto.ward || 'Clinical Ward'} at ${site.name} starting from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}.`,
      type: 'CLINICAL',
    });

    return rotation;
  }

  async getRotations(query: {
    studentId?: string;
    siteId?: string;
    facultyId?: string;
    status?: ClinicalStatus;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.siteId) where.siteId = query.siteId;
    if (query.facultyId) where.facultyId = query.facultyId;
    if (query.status) where.status = query.status;

    const [total, data] = await Promise.all([
      this.prisma.clinicalTraining.count({ where }),
      this.prisma.clinicalTraining.findMany({
        where,
        include: {
          site: true,
          faculty: { include: { user: true } },
          student: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
              program: { select: { name: true, code: true } },
            },
          },
        },
        orderBy: { startDate: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  async updateRotationStatus(id: string, status: ClinicalStatus, updaterId?: string) {
    const rotation = await this.prisma.clinicalTraining.findUnique({ where: { id } });
    if (!rotation) throw new NotFoundException('Rotation not found');

    const updated = await this.prisma.clinicalTraining.update({
      where: { id },
      data: { status },
      include: { site: true, student: { include: { user: true } } },
    });

    await this.auditService.log({
      userId: updaterId,
      action: 'ROTATION_STATUS',
      entity: 'ClinicalTraining',
      entityId: id,
      oldData: { status: rotation.status },
      newData: { status },
    });

    return updated;
  }

  // ----------------------------------------------------
  // NURSING PROCEDURAL SKILLS CATALOG
  // ----------------------------------------------------

  @Cacheable({
    key: 'clinical:skills:all',
    ttl: TTL_PRESETS.LONG,
    tags: ['clinical', 'skills'],
  })
  async getSkills(category?: string, subjectId?: string) {
    return this.prisma.nursingSkill.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(subjectId ? { subjectId } : {}),
      },
      include: {
        subject: true,
        _count: { select: { studentSkills: true } },
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  @CacheEvict({ tags: ['clinical', 'skills'] })
  async createSkill(dto: CreateNursingSkillDto) {
    return this.prisma.nursingSkill.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category || 'Basic Nursing Care',
        subjectId: dto.subjectId,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  // ----------------------------------------------------
  // STUDENT CLINICAL SKILL LOGBOOK & VERIFICATION
  // ----------------------------------------------------

  async recordSkillAttempt(dto: RecordSkillAttemptDto) {
    const [student, skill] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: dto.studentId } }),
      this.prisma.nursingSkill.findUnique({ where: { id: dto.skillId } }),
    ]);

    if (!student) throw new NotFoundException('Student not found');
    if (!skill) throw new NotFoundException('Nursing skill not found');

    return this.prisma.studentSkill.upsert({
      where: {
        studentId_skillId: {
          studentId: dto.studentId,
          skillId: dto.skillId,
        },
      },
      update: {
        status: SkillStatus.IN_PROGRESS,
        remarks: dto.remarks,
      },
      create: {
        studentId: dto.studentId,
        skillId: dto.skillId,
        status: SkillStatus.IN_PROGRESS,
        remarks: dto.remarks,
      },
      include: { skill: true },
    });
  }

  /**
   * Supervisor Verification of Nursing Procedural Competency
   */
  async verifySkill(
    studentId: string,
    skillId: string,
    supervisorFacultyId: string,
    dto: VerifySkillDto,
  ) {
    const [student, skill, supervisor] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: studentId }, include: { user: true } }),
      this.prisma.nursingSkill.findUnique({ where: { id: skillId } }),
      this.prisma.faculty.findUnique({ where: { id: supervisorFacultyId }, include: { user: true } }),
    ]);

    if (!student) throw new NotFoundException('Student not found');
    if (!skill) throw new NotFoundException('Skill not found');
    if (!supervisor) throw new NotFoundException('Supervisor faculty not found');

    // Object-Level Authorization: Is the faculty assigned as supervisor for this student in any clinical training/rotation?
    const isAssignedSupervisor = await this.prisma.clinicalTraining.findFirst({
      where: {
        studentId,
        facultyId: supervisor.id,
      },
    });

    if (!isAssignedSupervisor) {
      throw new ForbiddenException(
        'Forbidden: Faculty member is not assigned as an authorized clinical supervisor for this student.',
      );
    }

    const verified = await this.prisma.studentSkill.upsert({
      where: {
        studentId_skillId: {
          studentId,
          skillId,
        },
      },
      update: {
        verifiedBy: supervisor.id,
        score: dto.score,
        remarks: dto.remarks,
        status: dto.status,
        assessedAt: new Date(),
      },
      create: {
        studentId,
        skillId,
        verifiedBy: supervisor.id,
        score: dto.score,
        remarks: dto.remarks,
        status: dto.status,
        assessedAt: new Date(),
      },
      include: { skill: true, verifier: { include: { user: true } } },
    });

    await this.auditService.log({
      userId: supervisor.userId,
      action: 'SKILL_VERIFY',
      entity: 'StudentSkill',
      entityId: verified.id,
      newData: {
        studentId,
        skillName: skill.name,
        status: dto.status,
        score: dto.score,
        verifiedBy: supervisor.employeeId,
      },
    });

    // Notify student via BullMQ
    await this.jobsService.dispatchNotification({
      userId: student.userId,
      title: `Nursing Skill ${dto.status === SkillStatus.VERIFIED ? 'Verified' : 'Assessed'}: ${skill.name}`,
      message: `Your procedural logbook skill "${skill.name}" was assessed by ${supervisor.user.firstName} ${supervisor.user.lastName || ''} (Status: ${dto.status}, Score: ${dto.score || 'Satisfactory'}).`,
      type: 'CLINICAL',
    });

    return verified;
  }

  // ----------------------------------------------------
  // CLINICAL HOURS & PROGRESS ENGINE
  // ----------------------------------------------------

  async getStudentClinicalProgress(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        program: true,
        clinicalTrainings: {
          include: { site: true, faculty: { include: { user: true } } },
          orderBy: { startDate: 'desc' },
        },
        skills: {
          include: { skill: true, verifier: { include: { user: true } } },
        },
      },
    });

    if (!student) throw new NotFoundException('Student not found');

    const totalCatalogSkills = await this.prisma.nursingSkill.count({ where: { isActive: true } });
    const verifiedSkillsCount = student.skills.filter((s) => s.status === SkillStatus.VERIFIED).length;
    const inProgressSkillsCount = student.skills.filter((s) => s.status === SkillStatus.IN_PROGRESS).length;

    // Standard clinical requirement (BSN = 1200, Post-RN = 600, DPT = 800)
    const requiredHours = student.program.code.includes('BSN') ? 1200 : student.program.code.includes('POST') ? 600 : 800;

    // Calculate completed hours: 6 hours per rotation day for completed/active postings
    let completedHours = 0;
    for (const rot of student.clinicalTrainings) {
      if (rot.status === ClinicalStatus.COMPLETED || rot.status === ClinicalStatus.ACTIVE) {
        const diffMs = new Date(rot.endDate).getTime() - new Date(rot.startDate).getTime();
        const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        completedHours += Math.min(days * 6, 240); // Cap per single rotation
      }
    }

    const remainingHours = Math.max(0, requiredHours - completedHours);
    const hoursProgress = Number(((completedHours / requiredHours) * 100).toFixed(1));
    const skillsProgress = totalCatalogSkills > 0 ? Number(((verifiedSkillsCount / totalCatalogSkills) * 100).toFixed(1)) : 0;

    return {
      studentId: student.studentId,
      studentName: `${student.user.firstName} ${student.user.lastName || ''}`.trim(),
      programName: student.program.name,
      requiredClinicalHours: requiredHours,
      completedClinicalHours: completedHours,
      remainingClinicalHours: remainingHours,
      clinicalHoursProgressPercentage: hoursProgress,
      totalCatalogSkills,
      verifiedSkillsCount,
      inProgressSkillsCount,
      skillsCompetencyPercentage: skillsProgress,
      rotations: student.clinicalTrainings,
      logbookSkills: student.skills,
    };
  }

  // ----------------------------------------------------
  // SUPERVISOR DASHBOARD & ANALYTICS
  // ----------------------------------------------------

  async getSupervisorDashboard(facultyId: string) {
    const supervisor = await this.prisma.faculty.findUnique({
      where: { id: facultyId },
      include: {
        user: true,
        clinicalSupervisions: {
          include: { site: true, student: { include: { user: true, program: true } } },
        },
        skillsVerified: {
          include: { skill: true, student: { include: { user: true } } },
          orderBy: { assessedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!supervisor) throw new NotFoundException('Supervisor not found');

    const pendingSkillVerifications = await this.prisma.studentSkill.findMany({
      where: { status: SkillStatus.IN_PROGRESS },
      include: { skill: true, student: { include: { user: true, program: true } } },
      take: 20,
    });

    return {
      supervisorId: supervisor.id,
      supervisorName: `${supervisor.user.firstName} ${supervisor.user.lastName || ''}`.trim(),
      activeWardPostings: supervisor.clinicalSupervisions.filter((c) => c.status === ClinicalStatus.ACTIVE).length,
      totalAssignedStudents: supervisor.clinicalSupervisions.length,
      pendingVerificationCount: pendingSkillVerifications.length,
      pendingVerifications: pendingSkillVerifications,
      recentSignoffs: supervisor.skillsVerified,
    };
  }
}
