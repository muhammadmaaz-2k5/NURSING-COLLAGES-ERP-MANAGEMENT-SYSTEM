import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from '../../common/database/transaction.service';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateFacultyDto {
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  departmentId: string;
  campusId?: string;
  designation: string;
  qualification: string;
  specialization?: string;
  phone?: string;
  joiningDate?: string;
}

export interface UpdateFacultyDto {
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  campusId?: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
  phone?: string;
}

export interface QueryFacultyDto {
  departmentId?: string;
  campusId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FacultyService {
  private readonly logger = new Logger(FacultyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
  ) {}

  async findAll(query: QueryFacultyDto): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.campusId) where.campusId = query.campusId;

    if (query.search) {
      where.OR = [
        { employeeId: { contains: query.search, mode: 'insensitive' } },
        { designation: { contains: query.search, mode: 'insensitive' } },
        { specialization: { contains: query.search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { firstName: { contains: query.search, mode: 'insensitive' } },
              { lastName: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [total, faculty] = await Promise.all([
      this.prisma.faculty.count({ where }),
      this.prisma.faculty.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true } },
          department: { select: { id: true, name: true, code: true } },
          campus: { select: { id: true, name: true } },
          classSubjects: {
            include: { subject: true, class: true },
          },
          _count: {
            select: {
              classSubjects: true,
              exams: true,
              clinicalSupervisions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(faculty, total, page, limit);
  }

  async findOne(id: string) {
    const faculty = await this.prisma.faculty.findFirst({
      where: { OR: [{ id }, { employeeId: id }] },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true, status: true } },
        department: true,
        campus: true,
        classSubjects: {
          include: {
            subject: true,
            class: { include: { semester: { include: { program: true } }, academicSession: true } },
          },
        },
        exams: {
          include: { subject: true, semester: true },
          orderBy: { createdAt: 'desc' },
        },
        clinicalSupervisions: {
          include: { site: true, student: { include: { user: true } } },
          orderBy: { startDate: 'desc' },
        },
      },
    });

    if (!faculty) throw new NotFoundException(`Faculty with ID "${id}" not found`);
    return faculty;
  }

  async create(dto: CreateFacultyDto) {
    const department = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
    if (!department) throw new NotFoundException('Department not found');

    const year = new Date().getFullYear();
    const count = await this.prisma.faculty.count();
    const employeeId = `FAC-${year}-${String(count + 1).padStart(3, '0')}`;
    const rawPass = dto.password || 'Faculty@123';
    const passwordHash = await bcrypt.hash(rawPass, 10);

    return this.txService.run(async (tx) => {
      let user = await tx.user.findUnique({ where: { email: dto.email.toLowerCase() } });
      if (user) throw new ConflictException('User with this email already exists');

      user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          status: UserStatus.ACTIVE,
        },
      });

      const facultyRole = await tx.role.findUnique({ where: { name: 'FACULTY' } });
      if (facultyRole) {
        await tx.userRole.create({
          data: { userId: user.id, roleId: facultyRole.id },
        });
      }

      const faculty = await tx.faculty.create({
        data: {
          userId: user.id,
          departmentId: dto.departmentId,
          campusId: dto.campusId,
          employeeId,
          designation: dto.designation,
          qualification: dto.qualification,
          specialization: dto.specialization,
          joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : new Date(),
        },
        include: { user: true, department: true },
      });

      return faculty;
    });
  }

  async update(id: string, dto: UpdateFacultyDto) {
    const faculty = await this.prisma.faculty.findUnique({ where: { id } });
    if (!faculty) throw new NotFoundException('Faculty not found');

    if (dto.firstName || dto.lastName || dto.phone) {
      await this.prisma.user.update({
        where: { id: faculty.userId },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
        },
      });
    }

    return this.prisma.faculty.update({
      where: { id },
      data: {
        departmentId: dto.departmentId,
        campusId: dto.campusId,
        designation: dto.designation,
        qualification: dto.qualification,
        specialization: dto.specialization,
      },
      include: { user: true, department: true },
    });
  }

  async getWorkload(id: string) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: {
        classSubjects: {
          include: {
            subject: true,
            class: { include: { semester: { include: { program: true } } } },
          },
        },
      },
    });

    if (!faculty) throw new NotFoundException('Faculty not found');

    const totalCreditHours = faculty.classSubjects.reduce(
      (sum, cs) => sum + (cs.subject.creditHours || 0),
      0,
    );

    return {
      facultyId: faculty.id,
      employeeId: faculty.employeeId,
      totalCourses: faculty.classSubjects.length,
      totalCreditHours,
      assignedCourses: faculty.classSubjects.map((cs) => ({
        classSubjectId: cs.id,
        className: cs.class.name,
        programName: cs.class.semester.program.name,
        subjectCode: cs.subject.code,
        subjectName: cs.subject.name,
        creditHours: cs.subject.creditHours,
        theoryHours: cs.subject.theoryHours,
        practicalHours: cs.subject.practicalHours,
        isClinical: cs.subject.isClinical,
      })),
    };
  }
}
