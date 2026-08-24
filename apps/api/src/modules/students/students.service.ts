import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentStatus, Gender } from '@prisma/client';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'students:list:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['students'],
  })
  async findAll(status?: StudentStatus, programId?: string) {
    return this.prisma.student.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(programId ? { programId } : {}),
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true },
        },
        program: true,
        campus: true,
        _count: {
          select: {
            enrollments: true,
            attendance: true,
            results: true,
            clinicalTrainings: true,
          },
        },
      },
      orderBy: { admissionDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findFirst({
      where: {
        OR: [{ id }, { studentId: id }, { userId: id }],
      },
      include: {
        user: true,
        program: { include: { department: true } },
        campus: true,
        parents: { include: { parent: { include: { user: true } } } },
        enrollments: { include: { semester: true, class: true } },
        results: { include: { exam: true, subject: true } },
        payments: { include: { feeStructure: true } },
        clinicalTrainings: { include: { site: true, faculty: { include: { user: true } } } },
        skills: { include: { skill: true, verifier: { include: { user: true } } } },
        documents: true,
      },
    });

    if (!student) throw new NotFoundException(`Student with identifier "${id}" not found`);
    return student;
  }

  @CacheEvict({
    tags: ['students'],
    keys: ['students:list:all'],
  })
  async create(data: {
    userId: string;
    programId: string;
    campusId?: string;
    studentId: string;
    admissionDate?: Date;
    gender?: Gender;
    phone?: string;
    cnic?: string;
    address?: string;
    city?: string;
  }) {
    return this.prisma.student.create({
      data: {
        userId: data.userId,
        programId: data.programId,
        campusId: data.campusId,
        studentId: data.studentId,
        admissionDate: data.admissionDate || new Date(),
        gender: data.gender,
        phone: data.phone,
        cnic: data.cnic,
        address: data.address,
        city: data.city,
      },
      include: {
        user: true,
        program: true,
      },
    });
  }

  async getMetrics() {
    const total = await this.prisma.student.count();
    const active = await this.prisma.student.count({ where: { status: StudentStatus.ACTIVE } });
    const graduated = await this.prisma.student.count({ where: { status: StudentStatus.GRADUATED } });
    return { total, active, graduated };
  }
}
