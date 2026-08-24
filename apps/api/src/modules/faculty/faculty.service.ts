import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cacheable, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'faculty:list:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['faculty'],
  })
  async findAll(departmentId?: string) {
    return this.prisma.faculty.findMany({
      where: {
        ...(departmentId ? { departmentId } : {}),
      },
      include: {
        user: { select: { email: true, firstName: true, lastName: true, phone: true, avatarUrl: true } },
        department: true,
        campus: true,
        _count: {
          select: {
            classSubjects: true,
            clinicalSupervisions: true,
            skillsVerified: true,
          },
        },
      },
      orderBy: { employeeId: 'asc' },
    });
  }

  async findOne(id: string) {
    const faculty = await this.prisma.faculty.findFirst({
      where: {
        OR: [{ id }, { employeeId: id }, { userId: id }],
      },
      include: {
        user: true,
        department: true,
        campus: true,
        classSubjects: {
          include: {
            subject: true,
            class: { include: { semester: true } },
          },
        },
        clinicalSupervisions: {
          include: { site: true, student: { include: { user: true } } },
        },
      },
    });

    if (!faculty) throw new NotFoundException(`Faculty member with identifier "${id}" not found`);
    return faculty;
  }
}
