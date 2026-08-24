import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cacheable, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class AcademicService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'academic:departments:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['academic', 'departments'],
  })
  async getDepartments() {
    return this.prisma.department.findMany({
      include: {
        programs: true,
        _count: {
          select: {
            faculty: true,
            subjects: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Cacheable({
    key: 'academic:programs:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['academic', 'programs'],
  })
  async getPrograms() {
    return this.prisma.program.findMany({
      include: {
        department: true,
        _count: {
          select: {
            students: true,
            semesters: true,
            subjects: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Cacheable({
    key: 'academic:sessions:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['academic', 'sessions'],
  })
  async getSessions() {
    return this.prisma.academicSession.findMany({
      include: {
        semesters: true,
        _count: {
          select: {
            classes: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }
}
