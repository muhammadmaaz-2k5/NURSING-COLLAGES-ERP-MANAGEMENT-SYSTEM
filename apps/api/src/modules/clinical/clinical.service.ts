import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ClinicalStatus, SkillStatus } from '@prisma/client';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class ClinicalService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'clinical:sites:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['clinical'],
  })
  async getSites() {
    return this.prisma.clinicalSite.findMany({
      include: {
        _count: { select: { trainings: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getTrainings(studentId?: string, status?: ClinicalStatus) {
    return this.prisma.clinicalTraining.findMany({
      where: {
        ...(studentId ? { studentId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        student: { include: { user: true, program: true } },
        site: true,
        faculty: { include: { user: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  @Cacheable({
    key: 'clinical:skills:all',
    ttl: TTL_PRESETS.LONG,
    tags: ['clinical', 'skills'],
  })
  async getNursingSkills() {
    return this.prisma.nursingSkill.findMany({
      include: {
        subject: true,
        _count: { select: { studentSkills: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getStudentSkills(studentId: string) {
    return this.prisma.studentSkill.findMany({
      where: { studentId },
      include: {
        skill: true,
        verifier: { include: { user: true } },
      },
    });
  }

  @CacheEvict({
    tags: ['clinical'],
  })
  async verifySkill(data: {
    studentId: string;
    skillId: string;
    verifiedBy: string;
    score?: number;
    remarks?: string;
    status: SkillStatus;
  }) {
    return this.prisma.studentSkill.upsert({
      where: {
        studentId_skillId: {
          studentId: data.studentId,
          skillId: data.skillId,
        },
      },
      update: {
        verifiedBy: data.verifiedBy,
        score: data.score,
        remarks: data.remarks,
        status: data.status,
        assessedAt: new Date(),
      },
      create: {
        studentId: data.studentId,
        skillId: data.skillId,
        verifiedBy: data.verifiedBy,
        score: data.score,
        remarks: data.remarks,
        status: data.status,
        assessedAt: new Date(),
      },
    });
  }
}
