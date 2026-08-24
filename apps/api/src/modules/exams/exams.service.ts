import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExamType, ExamStatus, ResultStatus } from '@prisma/client';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'exams:list:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['exams'],
  })
  async findAll(semesterId?: string, type?: ExamType) {
    return this.prisma.exam.findMany({
      where: {
        ...(semesterId ? { semesterId } : {}),
        ...(type ? { type } : {}),
      },
      include: {
        subject: true,
        semester: { include: { program: true } },
        faculty: { include: { user: true } },
        _count: { select: { results: true } },
      },
      orderBy: { examDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        subject: true,
        semester: { include: { program: true } },
        faculty: { include: { user: true } },
        results: {
          include: { student: { include: { user: true } } },
          orderBy: { marks: 'desc' },
        },
      },
    });

    if (!exam) throw new NotFoundException(`Exam with ID "${id}" not found`);
    return exam;
  }

  @CacheEvict({
    tags: ['exams'],
    keys: ['exams:list:all'],
  })
  async create(data: {
    semesterId: string;
    subjectId: string;
    facultyId?: string;
    name: string;
    type: ExamType;
    totalMarks: number;
    passingMarks: number;
    examDate?: Date;
    startTime?: string;
    endTime?: string;
  }) {
    return this.prisma.exam.create({
      data,
      include: { subject: true, semester: true },
    });
  }

  @CacheEvict({
    tags: ['exams', 'results'],
  })
  async recordResults(examId: string, records: { studentId: string; marks: number; remarks?: string }[]) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');

    const results = [];
    for (const r of records) {
      const percentage = (r.marks / exam.totalMarks) * 100;
      let grade = 'F';
      let gradePoint = 0.0;
      let status: ResultStatus = ResultStatus.FAIL;

      if (percentage >= 85) { grade = 'A+'; gradePoint = 4.0; status = ResultStatus.PASS; }
      else if (percentage >= 80) { grade = 'A'; gradePoint = 3.7; status = ResultStatus.PASS; }
      else if (percentage >= 75) { grade = 'B+'; gradePoint = 3.3; status = ResultStatus.PASS; }
      else if (percentage >= 70) { grade = 'B'; gradePoint = 3.0; status = ResultStatus.PASS; }
      else if (percentage >= 60) { grade = 'C'; gradePoint = 2.5; status = ResultStatus.PASS; }
      else if (percentage >= 50) { grade = 'D'; gradePoint = 2.0; status = ResultStatus.PASS; }

      const res = await this.prisma.result.upsert({
        where: {
          examId_studentId: {
            examId,
            studentId: r.studentId,
          },
        },
        update: {
          marks: r.marks,
          grade,
          gradePoint,
          status,
          remarks: r.remarks,
        },
        create: {
          examId,
          studentId: r.studentId,
          subjectId: exam.subjectId,
          marks: r.marks,
          grade,
          gradePoint,
          status,
          remarks: r.remarks,
        },
      });
      results.push(res);
    }

    return results;
  }
}
