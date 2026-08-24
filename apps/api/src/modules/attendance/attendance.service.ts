import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';
import { CacheEvict } from '../../common/cache';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentAttendance(studentId: string, subjectId?: string) {
    return this.prisma.studentAttendance.findMany({
      where: {
        studentId,
        ...(subjectId ? { subjectId } : {}),
      },
      include: {
        subject: true,
        class: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async getClassAttendance(classId: string, subjectId: string, date: string) {
    const targetDate = new Date(date);
    return this.prisma.studentAttendance.findMany({
      where: {
        classId,
        subjectId,
        date: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lte: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        student: {
          include: { user: true },
        },
      },
    });
  }

  @CacheEvict({
    tags: ['attendance'],
  })
  async markStudentAttendance(records: {
    studentId: string;
    subjectId: string;
    classId: string;
    date: string;
    status: AttendanceStatus;
    remarks?: string;
  }[]) {
    const created = [];
    for (const r of records) {
      const entry = await this.prisma.studentAttendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId: r.studentId,
            subjectId: r.subjectId,
            date: new Date(r.date),
          },
        },
        update: {
          status: r.status,
          remarks: r.remarks,
        },
        create: {
          studentId: r.studentId,
          subjectId: r.subjectId,
          classId: r.classId,
          date: new Date(r.date),
          status: r.status,
          remarks: r.remarks,
        },
      });
      created.push(entry);
    }
    return created;
  }
}
