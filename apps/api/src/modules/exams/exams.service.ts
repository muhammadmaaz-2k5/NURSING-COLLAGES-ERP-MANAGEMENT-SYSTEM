import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from '../../common/database/transaction.service';
import { AuditService } from '../../common/audit/audit.service';
import { JobsService } from '../../common/jobs/jobs.service';
import { ExamType, ExamStatus, ResultStatus } from '@prisma/client';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateExamDto {
  semesterId: string;
  subjectId: string;
  facultyId?: string;
  name: string;
  type: ExamType;
  totalMarks: number;
  passingMarks: number;
  examDate?: string;
  startTime?: string;
  endTime?: string;
}

export interface StudentMarksInput {
  studentId: string;
  marks: number;
  remarks?: string;
}

export interface EnterMarksDto {
  examId: string;
  records: StudentMarksInput[];
}

@Injectable()
export class ExamsService {
  private readonly logger = new Logger(ExamsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  async createExam(dto: CreateExamDto) {
    const semester = await this.prisma.semester.findUnique({ where: { id: dto.semesterId } });
    if (!semester) throw new NotFoundException('Semester not found');

    const subject = await this.prisma.subject.findUnique({ where: { id: dto.subjectId } });
    if (!subject) throw new NotFoundException('Subject not found');

    return this.prisma.exam.create({
      data: {
        semesterId: dto.semesterId,
        subjectId: dto.subjectId,
        facultyId: dto.facultyId,
        name: dto.name,
        type: dto.type,
        totalMarks: dto.totalMarks,
        passingMarks: dto.passingMarks,
        examDate: dto.examDate ? new Date(dto.examDate) : undefined,
        startTime: dto.startTime,
        endTime: dto.endTime,
        status: ExamStatus.SCHEDULED,
      },
      include: {
        semester: { include: { program: true } },
        subject: true,
        faculty: { include: { user: true } },
      },
    });
  }

  async findExams(query: { semesterId?: string; subjectId?: string; status?: ExamStatus; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.semesterId) where.semesterId = query.semesterId;
    if (query.subjectId) where.subjectId = query.subjectId;
    if (query.status) where.status = query.status;

    const [total, data] = await Promise.all([
      this.prisma.exam.count({ where }),
      this.prisma.exam.findMany({
        where,
        include: {
          semester: { include: { program: true } },
          subject: true,
          faculty: { include: { user: true } },
          _count: { select: { results: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        semester: { include: { program: true } },
        subject: true,
        faculty: { include: { user: true } },
        results: {
          include: {
            student: { include: { user: true } },
          },
          orderBy: { marks: 'desc' },
        },
      },
    });

    if (!exam) throw new NotFoundException(`Exam "${id}" not found`);
    return exam;
  }

  /**
   * Resolves dynamic grading scale from college settings and computes grade & grade point
   */
  private async resolveGrade(percentage: number): Promise<{ grade: string; gradePoint: number }> {
    const college = await this.prisma.college.findFirst({
      include: { settings: true },
    });

    const scales = (college?.settings?.gradingSystem as any)?.scales || [
      { grade: 'A+', minPercentage: 85, gpa: 4.0 },
      { grade: 'A', minPercentage: 80, gpa: 3.7 },
      { grade: 'B+', minPercentage: 75, gpa: 3.3 },
      { grade: 'B', minPercentage: 70, gpa: 3.0 },
      { grade: 'C+', minPercentage: 65, gpa: 2.7 },
      { grade: 'C', minPercentage: 60, gpa: 2.3 },
      { grade: 'D', minPercentage: 50, gpa: 2.0 },
      { grade: 'F', minPercentage: 0, gpa: 0.0 },
    ];

    for (const scale of scales) {
      if (percentage >= scale.minPercentage) {
        return { grade: scale.grade, gradePoint: scale.gpa };
      }
    }

    return { grade: 'F', gradePoint: 0.0 };
  }

  /**
   * Enter or update student marks with automated grading and audit tracking
   */
  async enterMarks(dto: EnterMarksDto, userId?: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id: dto.examId } });
    if (!exam) throw new NotFoundException('Exam not found');

    if (exam.status === ExamStatus.COMPLETED) {
      throw new BadRequestException('Results for this exam have been published and are locked.');
    }

    return this.txService.run(async (tx) => {
      const results = [];
      for (const record of dto.records) {
        if (record.marks > exam.totalMarks) {
          throw new BadRequestException(
            `Obtained marks (${record.marks}) cannot exceed maximum total marks (${exam.totalMarks})`,
          );
        }

        const percentage = (record.marks / exam.totalMarks) * 100;
        const { grade, gradePoint } = await this.resolveGrade(percentage);
        const status = record.marks >= exam.passingMarks ? ResultStatus.PASS : ResultStatus.FAIL;

        const res = await tx.result.upsert({
          where: {
            examId_studentId: {
              examId: dto.examId,
              studentId: record.studentId,
            },
          },
          update: {
            marks: record.marks,
            grade,
            gradePoint,
            status,
            remarks: record.remarks,
          },
          create: {
            examId: dto.examId,
            studentId: record.studentId,
            subjectId: exam.subjectId,
            marks: record.marks,
            grade,
            gradePoint,
            status,
            remarks: record.remarks,
          },
        });
        results.push(res);
      }

      await this.auditService.log({
        userId,
        action: 'MARKS_ENTRY',
        entity: 'Exam',
        entityId: dto.examId,
        newData: { entriesCount: results.length },
      });

      return {
        success: true,
        savedResults: results.length,
      };
    });
  }

  /**
   * Publish results and lock marks
   */
  async publishResults(examId: string, publisherId?: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: {
        subject: true,
        results: { include: { student: { include: { user: true } } } },
      },
    });

    if (!exam) throw new NotFoundException('Exam not found');
    if (exam.results.length === 0) {
      throw new BadRequestException('Cannot publish exam without any entered marks.');
    }

    const updated = await this.prisma.exam.update({
      where: { id: examId },
      data: { status: ExamStatus.COMPLETED },
    });

    await this.auditService.log({
      userId: publisherId,
      action: 'PUBLISH',
      entity: 'ExamResult',
      entityId: examId,
      newData: { examName: exam.name, resultsCount: exam.results.length },
    });

    // Notify students via BullMQ
    for (const r of exam.results) {
      await this.jobsService.dispatchNotification({
        userId: r.student.userId,
        title: `Exam Results Published: ${exam.name}`,
        message: `Your result for ${exam.subject.name} has been published: Marks ${r.marks}/${exam.totalMarks} (${r.grade} - GP ${r.gradePoint}).`,
        type: 'ACADEMIC',
      });
    }

    return { success: true, exam: updated, publishedCount: exam.results.length };
  }

  /**
   * Dynamic GPA and CGPA Transcript Computation
   */
  async getStudentTranscript(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        program: { include: { department: true } },
        enrollments: {
          include: {
            semester: {
              include: {
                subjects: { include: { subject: true } },
                exams: {
                  include: {
                    subject: true,
                    results: { where: { studentId } },
                  },
                },
              },
            },
          },
          orderBy: { semester: { number: 'asc' } },
        },
      },
    });

    if (!student) throw new NotFoundException('Student not found');

    let totalCumulativeQualityPoints = 0;
    let totalCumulativeCreditHours = 0;

    const semestersTranscript = student.enrollments.map((enrollment) => {
      const semester = enrollment.semester;
      let semesterQualityPoints = 0;
      let semesterCreditHours = 0;

      const courseGrades = semester.exams.map((exam) => {
        const result = exam.results[0];
        const credit = exam.subject.creditHours || 3;
        const gp = result?.gradePoint ?? 0;
        const qp = credit * gp;

        if (result) {
          semesterQualityPoints += qp;
          semesterCreditHours += credit;
        }

        return {
          examName: exam.name,
          examType: exam.type,
          subjectCode: exam.subject.code,
          subjectName: exam.subject.name,
          creditHours: credit,
          obtainedMarks: result?.marks ?? null,
          totalMarks: exam.totalMarks,
          letterGrade: result?.grade ?? 'N/A',
          gradePoint: gp,
          status: result?.status ?? 'PENDING',
        };
      });

      const semesterGpa = semesterCreditHours > 0
        ? (semesterQualityPoints / semesterCreditHours).toFixed(2)
        : '0.00';

      totalCumulativeQualityPoints += semesterQualityPoints;
      totalCumulativeCreditHours += semesterCreditHours;

      return {
        semesterId: semester.id,
        semesterName: semester.name,
        semesterNumber: semester.number,
        courses: courseGrades,
        semesterGpa: Number(semesterGpa),
        totalCredits: semesterCreditHours,
      };
    });

    const cumulativeCgpa = totalCumulativeCreditHours > 0
      ? (totalCumulativeQualityPoints / totalCumulativeCreditHours).toFixed(2)
      : '0.00';

    return {
      studentId: student.studentId,
      studentName: `${student.user.firstName} ${student.user.lastName || ''}`.trim(),
      programName: student.program.name,
      departmentName: student.program.department.name,
      cgpa: Number(cumulativeCgpa),
      totalCreditHoursEarned: totalCumulativeCreditHours,
      semesters: semestersTranscript,
    };
  }
}
