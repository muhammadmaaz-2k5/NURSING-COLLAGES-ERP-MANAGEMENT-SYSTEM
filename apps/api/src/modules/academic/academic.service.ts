import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';
import { RoomType, SemesterType, SemesterStatus } from '@prisma/client';

@Injectable()
export class AcademicService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------
  // CAMPUS, BUILDINGS & ROOMS
  // ----------------------------------------------------

  @Cacheable({
    key: 'academic:campuses:all',
    ttl: TTL_PRESETS.LONG,
    tags: ['academic', 'campus'],
  })
  async getCampuses() {
    return this.prisma.campus.findMany({
      include: {
        buildings: {
          include: {
            rooms: true,
          },
        },
        _count: {
          select: { students: true, faculty: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({ tags: ['academic', 'campus'] })
  async createCampus(data: { name: string; code: string; address?: string; city?: string; phone?: string }) {
    const existing = await this.prisma.campus.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Campus with code "${data.code}" already exists`);

    return this.prisma.campus.create({ data });
  }

  @CacheEvict({ tags: ['academic', 'campus'] })
  async createBuilding(data: { campusId: string; name: string; code?: string }) {
    return this.prisma.building.create({ data });
  }

  @CacheEvict({ tags: ['academic', 'campus'] })
  async createRoom(data: {
    buildingId: string;
    name: string;
    roomNumber?: string;
    type: RoomType;
    capacity?: number;
  }) {
    return this.prisma.room.create({ data });
  }

  async getRooms(buildingId?: string, type?: RoomType) {
    return this.prisma.room.findMany({
      where: {
        ...(buildingId ? { buildingId } : {}),
        ...(type ? { type } : {}),
      },
      include: { building: { include: { campus: true } } },
      orderBy: { name: 'asc' },
    });
  }

  // ----------------------------------------------------
  // DEPARTMENTS & DEGREE PROGRAMS
  // ----------------------------------------------------

  @Cacheable({
    key: 'academic:departments:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['academic', 'departments'],
  })
  async getDepartments() {
    return this.prisma.department.findMany({
      include: {
        programs: {
          include: {
            _count: { select: { students: true, semesters: true, subjects: true } },
          },
        },
        _count: {
          select: {
            faculty: true,
            subjects: true,
            employees: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({ tags: ['academic', 'departments'] })
  async createDepartment(data: { name: string; code: string; description?: string }) {
    const existing = await this.prisma.department.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Department with code "${data.code}" already exists`);

    return this.prisma.department.create({ data });
  }

  @Cacheable({
    key: 'academic:programs:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['academic', 'programs'],
  })
  async getPrograms(departmentId?: string) {
    return this.prisma.program.findMany({
      where: {
        ...(departmentId ? { departmentId } : {}),
      },
      include: {
        department: true,
        _count: {
          select: {
            students: true,
            semesters: true,
            subjects: true,
            feeStructures: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({ tags: ['academic', 'programs'] })
  async createProgram(data: {
    departmentId: string;
    name: string;
    code: string;
    description?: string;
    durationYears?: number;
    totalCredits?: number;
  }) {
    const existing = await this.prisma.program.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Program with code "${data.code}" already exists`);

    return this.prisma.program.create({
      data,
      include: { department: true },
    });
  }

  // ----------------------------------------------------
  // ACADEMIC SESSIONS & SEMESTERS
  // ----------------------------------------------------

  @Cacheable({
    key: 'academic:sessions:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['academic', 'sessions'],
  })
  async getSessions() {
    return this.prisma.academicSession.findMany({
      include: {
        semesters: {
          include: { program: true },
          orderBy: { number: 'asc' },
        },
        _count: { select: { classes: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  @CacheEvict({ tags: ['academic', 'sessions'] })
  async createSession(data: { name: string; startDate: Date; endDate: Date; isActive?: boolean }) {
    const existing = await this.prisma.academicSession.findUnique({ where: { name: data.name } });
    if (existing) throw new ConflictException(`Session "${data.name}" already exists`);

    if (data.isActive) {
      // Deactivate other sessions
      await this.prisma.academicSession.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.academicSession.create({ data });
  }

  @CacheEvict({ tags: ['academic', 'sessions'] })
  async createSemester(data: {
    academicSessionId: string;
    programId: string;
    name: string;
    number: number;
    type: SemesterType;
    status?: SemesterStatus;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.semester.create({
      data,
      include: {
        academicSession: true,
        program: true,
      },
    });
  }

  async getSemesters(programId?: string, sessionId?: string) {
    return this.prisma.semester.findMany({
      where: {
        ...(programId ? { programId } : {}),
        ...(sessionId ? { academicSessionId: sessionId } : {}),
      },
      include: {
        program: true,
        academicSession: true,
        subjects: {
          include: { subject: true },
        },
        classes: true,
        _count: { select: { enrollments: true, exams: true } },
      },
      orderBy: [{ academicSession: { startDate: 'desc' } }, { number: 'asc' }],
    });
  }

  // ----------------------------------------------------
  // SUBJECTS & CURRICULUM
  // ----------------------------------------------------

  @Cacheable({
    key: 'academic:subjects:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['academic', 'subjects'],
  })
  async getSubjects(departmentId?: string, programId?: string) {
    return this.prisma.subject.findMany({
      where: {
        ...(departmentId ? { departmentId } : {}),
        ...(programId ? { programId } : {}),
      },
      include: {
        department: true,
        program: true,
        _count: { select: { classes: true, exams: true, skills: true } },
      },
      orderBy: { code: 'asc' },
    });
  }

  @CacheEvict({ tags: ['academic', 'subjects'] })
  async createSubject(data: {
    departmentId: string;
    programId?: string;
    name: string;
    code: string;
    description?: string;
    creditHours: number;
    theoryHours?: number;
    practicalHours?: number;
    isClinical?: boolean;
  }) {
    const existing = await this.prisma.subject.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Subject code "${data.code}" already exists`);

    return this.prisma.subject.create({
      data,
      include: { department: true, program: true },
    });
  }

  @CacheEvict({ tags: ['academic', 'subjects', 'sessions'] })
  async assignSubjectToSemester(semesterId: string, subjectId: string, isMandatory = true) {
    return this.prisma.semesterSubject.upsert({
      where: {
        semesterId_subjectId: {
          semesterId,
          subjectId,
        },
      },
      update: { isMandatory },
      create: {
        semesterId,
        subjectId,
        isMandatory,
      },
      include: { semester: true, subject: true },
    });
  }

  // ----------------------------------------------------
  // CLASS SECTIONS & TIMETABLES
  // ----------------------------------------------------

  async getClasses(semesterId?: string, sessionId?: string) {
    return this.prisma.classSection.findMany({
      where: {
        ...(semesterId ? { semesterId } : {}),
        ...(sessionId ? { academicSessionId: sessionId } : {}),
      },
      include: {
        semester: { include: { program: true } },
        academicSession: true,
        room: true,
        subjects: {
          include: {
            subject: true,
            faculty: { include: { user: true } },
          },
        },
        timetable: {
          include: { classSubject: { include: { subject: true, faculty: { include: { user: true } } } } },
        },
        _count: { select: { students: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createClass(data: {
    academicSessionId: string;
    semesterId: string;
    name: string;
    roomId?: string;
    capacity?: number;
  }) {
    return this.prisma.classSection.create({
      data,
      include: { semester: true, academicSession: true, room: true },
    });
  }

  async assignFacultyToClassSubject(classId: string, subjectId: string, facultyId?: string) {
    return this.prisma.classSubject.upsert({
      where: {
        classId_subjectId: {
          classId,
          subjectId,
        },
      },
      update: { facultyId },
      create: {
        classId,
        subjectId,
        facultyId,
      },
      include: {
        class: true,
        subject: true,
        faculty: { include: { user: true } },
      },
    });
  }

  async createTimetableSlot(data: {
    classId: string;
    classSubjectId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    roomId?: string;
  }) {
    // Room clash validation
    if (data.roomId) {
      const roomClash = await this.prisma.timetable.findFirst({
        where: {
          class: { roomId: data.roomId },
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
        },
        include: { class: true },
      });

      if (roomClash) {
        throw new BadRequestException(
          `Room clash: Room is already booked on day ${data.dayOfWeek} at ${data.startTime}`,
        );
      }
    }

    return this.prisma.timetable.create({
      data: {
        classId: data.classId,
        classSubjectId: data.classSubjectId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      },
      include: {
        classSubject: {
          include: {
            subject: true,
            faculty: { include: { user: true } },
          },
        },
      },
    });
  }
}
