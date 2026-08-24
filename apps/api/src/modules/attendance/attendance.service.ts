import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from '../../common/database/transaction.service';
import { AttendanceStatus } from '@prisma/client';

export interface MarkStudentAttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface MarkBatchAttendanceDto {
  classId: string;
  subjectId: string;
  date: string;
  records: MarkStudentAttendanceRecord[];
}

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
  ) {}

  /**
   * Bulk or individual student attendance marking for a class section & subject
   */
  async markStudentBatch(dto: MarkBatchAttendanceDto) {
    const classSection = await this.prisma.classSection.findUnique({ where: { id: dto.classId } });
    if (!classSection) throw new NotFoundException('Class section not found');

    const subject = await this.prisma.subject.findUnique({ where: { id: dto.subjectId } });
    if (!subject) throw new NotFoundException('Subject not found');

    const attendanceDate = new Date(dto.date);
    attendanceDate.setHours(0, 0, 0, 0);

    return this.txService.run(async (tx) => {
      const results = [];
      for (const record of dto.records) {
        const item = await tx.studentAttendance.upsert({
          where: {
            studentId_subjectId_date: {
              studentId: record.studentId,
              subjectId: dto.subjectId,
              date: attendanceDate,
            },
          },
          update: {
            classId: dto.classId,
            status: record.status,
            remarks: record.remarks,
          },
          create: {
            studentId: record.studentId,
            subjectId: dto.subjectId,
            classId: dto.classId,
            date: attendanceDate,
            status: record.status,
            remarks: record.remarks,
          },
        });
        results.push(item);
      }
      return {
        success: true,
        markedCount: results.length,
        date: attendanceDate.toISOString().split('T')[0],
      };
    });
  }

  /**
   * Retrieve class section roster with attendance on a specific date
   */
  async getClassAttendanceSheet(classId: string, subjectId: string, date: string) {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const enrolledStudents = await this.prisma.studentEnrollment.findMany({
      where: { classId, status: 'ACTIVE' },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
      orderBy: { student: { studentId: 'asc' } },
    });

    const existingAttendance = await this.prisma.studentAttendance.findMany({
      where: {
        classId,
        subjectId,
        date: attendanceDate,
      },
    });

    const attendanceMap = new Map(existingAttendance.map((a) => [a.studentId, a]));

    const roster = enrolledStudents.map((enrollment) => {
      const att = attendanceMap.get(enrollment.studentId);
      return {
        studentId: enrollment.studentId,
        registrationNo: enrollment.student.studentId,
        studentName: `${enrollment.student.user.firstName} ${enrollment.student.user.lastName || ''}`.trim(),
        email: enrollment.student.user.email,
        status: att?.status || AttendanceStatus.PRESENT,
        remarks: att?.remarks || null,
        marked: !!att,
      };
    });

    return {
      classId,
      subjectId,
      date: attendanceDate.toISOString().split('T')[0],
      totalEnrolled: enrolledStudents.length,
      roster,
    };
  }

  /**
   * Get student individual attendance analytics per subject
   */
  async getStudentAttendanceSummary(studentId: string, subjectId?: string) {
    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const records = await this.prisma.studentAttendance.findMany({
      where: {
        studentId,
        ...(subjectId ? { subjectId } : {}),
      },
      include: { subject: true },
      orderBy: { date: 'desc' },
    });

    const totalLectures = records.length;
    const presentCount = records.filter(
      (r) => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE,
    ).length;
    const absentCount = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const percentage = totalLectures > 0 ? ((presentCount / totalLectures) * 100).toFixed(1) : '100.0';

    return {
      studentId,
      totalLectures,
      presentCount,
      absentCount,
      percentage: Number(percentage),
      isEligibleForExams: Number(percentage) >= 75.0, // Standard 75% PNC attendance threshold
      recentRecords: records.slice(0, 15),
    };
  }

  /**
   * Mark faculty daily attendance
   */
  async markFacultyAttendance(facultyId: string, date: string, status: AttendanceStatus, remarks?: string) {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    return this.prisma.facultyAttendance.upsert({
      where: {
        facultyId_date: {
          facultyId,
          date: attendanceDate,
        },
      },
      update: { status, remarks },
      create: {
        facultyId,
        date: attendanceDate,
        status,
        remarks,
      },
    });
  }
}
