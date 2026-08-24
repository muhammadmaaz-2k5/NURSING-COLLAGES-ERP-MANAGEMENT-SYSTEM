import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from '../../common/database/transaction.service';
import { StorageService } from '../../common/storage/storage.service';
import {
  StudentStatus,
  Gender,
  DocumentType,
  UserStatus,
  EnrollmentStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateStudentDto {
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  programId: string;
  campusId?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  cnic?: string;
  phone?: string;
  address?: string;
  city?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  cnic?: string;
  phone?: string;
  address?: string;
  city?: string;
  status?: StudentStatus;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
}

export interface AddParentDto {
  email: string;
  firstName: string;
  lastName?: string;
  phone: string;
  occupation?: string;
  relationship: string;
  isPrimary?: boolean;
}

export interface QueryStudentsDto {
  search?: string;
  status?: StudentStatus;
  programId?: string;
  campusId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly storageService: StorageService,
  ) {}

  async findAll(query: QueryStudentsDto): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.programId) where.programId = query.programId;
    if (query.campusId) where.campusId = query.campusId;

    if (query.search) {
      where.OR = [
        { studentId: { contains: query.search, mode: 'insensitive' } },
        { cnic: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
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

    const [total, students] = await Promise.all([
      this.prisma.student.count({ where }),
      this.prisma.student.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
          },
          program: { select: { id: true, name: true, code: true } },
          campus: { select: { id: true, name: true } },
          enrollments: {
            take: 1,
            orderBy: { enrolledAt: 'desc' },
            include: { semester: true, class: true },
          },
          _count: {
            select: {
              enrollments: true,
              attendance: true,
              results: true,
              payments: true,
              skills: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(students, total, page, limit);
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findFirst({
      where: { OR: [{ id }, { studentId: id }] },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true, status: true } },
        program: { include: { department: true } },
        campus: true,
        parents: {
          include: {
            parent: {
              include: {
                user: { select: { email: true, firstName: true, lastName: true, phone: true } },
              },
            },
          },
        },
        documents: true,
        enrollments: {
          include: {
            semester: true,
            class: { include: { subjects: { include: { subject: true, faculty: { include: { user: true } } } } } },
          },
          orderBy: { enrolledAt: 'desc' },
        },
        results: {
          include: { exam: true, subject: true },
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          include: { feeStructure: true },
          orderBy: { createdAt: 'desc' },
        },
        clinicalTrainings: {
          include: { site: true, faculty: { include: { user: true } } },
          orderBy: { startDate: 'desc' },
        },
        skills: {
          include: { skill: true, verifier: { include: { user: true } } },
        },
      },
    });

    if (!student) throw new NotFoundException(`Student "${id}" not found`);
    return student;
  }

  async create(dto: CreateStudentDto) {
    const program = await this.prisma.program.findUnique({ where: { id: dto.programId } });
    if (!program) throw new NotFoundException('Program not found');

    const year = new Date().getFullYear();
    const studentCount = await this.prisma.student.count();
    const studentId = `STD-${year}-${String(studentCount + 1).padStart(4, '0')}`;
    const rawPass = dto.password || 'Student@123';
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

      const studentRole = await tx.role.findUnique({ where: { name: 'STUDENT' } });
      if (studentRole) {
        await tx.userRole.create({
          data: { userId: user.id, roleId: studentRole.id },
        });
      }

      const student = await tx.student.create({
        data: {
          userId: user.id,
          programId: dto.programId,
          campusId: dto.campusId,
          studentId,
          admissionDate: new Date(),
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          gender: dto.gender,
          bloodGroup: dto.bloodGroup,
          nationality: dto.nationality || 'Pakistani',
          religion: dto.religion,
          cnic: dto.cnic,
          phone: dto.phone,
          address: dto.address,
          city: dto.city,
          emergencyName: dto.emergencyName,
          emergencyPhone: dto.emergencyPhone,
          emergencyRelation: dto.emergencyRelation,
        },
        include: { user: true, program: true },
      });

      return student;
    });
  }

  async update(id: string, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    if (dto.firstName || dto.lastName) {
      await this.prisma.user.update({
        where: { id: student.userId },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        bloodGroup: dto.bloodGroup,
        nationality: dto.nationality,
        religion: dto.religion,
        cnic: dto.cnic,
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        status: dto.status,
        emergencyName: dto.emergencyName,
        emergencyPhone: dto.emergencyPhone,
        emergencyRelation: dto.emergencyRelation,
      },
      include: { user: true, program: true },
    });
  }

  async addParent(studentId: string, dto: AddParentDto) {
    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const rawPass = 'Parent@123';
    const passwordHash = await bcrypt.hash(rawPass, 10);

    return this.txService.run(async (tx) => {
      let user = await tx.user.findUnique({ where: { email: dto.email.toLowerCase() } });
      if (!user) {
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
      }

      let parent = await tx.parent.findUnique({ where: { userId: user.id } });
      if (!parent) {
        parent = await tx.parent.create({
          data: {
            userId: user.id,
            occupation: dto.occupation,
            relationship: dto.relationship,
          },
        });
      }

      const studentParent = await tx.studentParent.upsert({
        where: {
          studentId_parentId: {
            studentId,
            parentId: parent.id,
          },
        },
        update: { isPrimary: dto.isPrimary ?? false },
        create: {
          studentId,
          parentId: parent.id,
          isPrimary: dto.isPrimary ?? false,
        },
        include: { parent: { include: { user: true } } },
      });

      return studentParent;
    });
  }

  async uploadDocument(
    studentId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    type: DocumentType,
  ) {
    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const savedFile = await this.storageService.saveFile(
      fileBuffer,
      originalName,
      mimeType,
      'students',
    );

    return this.prisma.studentDocument.create({
      data: {
        studentId,
        type,
        fileUrl: savedFile.url,
        fileName: originalName,
      },
    });
  }

  async enrollSemester(studentId: string, semesterId: string, classId: string) {
    const [student, semester, classSection] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: studentId } }),
      this.prisma.semester.findUnique({ where: { id: semesterId } }),
      this.prisma.classSection.findUnique({ where: { id: classId } }),
    ]);

    if (!student) throw new NotFoundException('Student not found');
    if (!semester) throw new NotFoundException('Semester not found');
    if (!classSection) throw new NotFoundException('Class section not found');

    return this.prisma.studentEnrollment.upsert({
      where: {
        studentId_semesterId: {
          studentId,
          semesterId,
        },
      },
      update: {
        classId,
        status: EnrollmentStatus.ACTIVE,
      },
      create: {
        studentId,
        semesterId,
        classId,
        status: EnrollmentStatus.ACTIVE,
      },
      include: {
        semester: { include: { program: true } },
        class: true,
      },
    });
  }

  async getMetrics() {
    const total = await this.prisma.student.count();
    const active = await this.prisma.student.count({ where: { status: StudentStatus.ACTIVE } });
    const graduated = await this.prisma.student.count({ where: { status: StudentStatus.GRADUATED } });
    const suspended = await this.prisma.student.count({ where: { status: StudentStatus.SUSPENDED } });

    return { total, active, graduated, suspended };
  }
}
