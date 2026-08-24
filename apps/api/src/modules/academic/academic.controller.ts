import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { AcademicService } from './academic.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Audited } from '../../common/audit/audit.decorator';
import { RoomType, SemesterType, SemesterStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

class CreateCampusDto {
  @ApiProperty({ example: 'Main Healthcare Campus' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'MC-01' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'Sector H-8/4', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Islamabad', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: '+92-51-111-222-333', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

class CreateBuildingDto {
  @ApiProperty({ example: 'campus-cuid-123' })
  @IsNotEmpty()
  @IsString()
  campusId: string;

  @ApiProperty({ example: 'Nursing Academic Block A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'BLK-A', required: false })
  @IsOptional()
  @IsString()
  code?: string;
}

class CreateRoomDto {
  @ApiProperty({ example: 'building-cuid-123' })
  @IsNotEmpty()
  @IsString()
  buildingId: string;

  @ApiProperty({ example: 'Clinical Skills Lab 1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'LAB-102', required: false })
  @IsOptional()
  @IsString()
  roomNumber?: string;

  @ApiProperty({ enum: RoomType, example: RoomType.LAB })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({ example: 40, required: false })
  @IsOptional()
  @IsNumber()
  capacity?: number;
}

class CreateDepartmentDto {
  @ApiProperty({ example: 'Department of Nursing & Clinical Care' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'NUR-DEPT' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'Primary clinical education and nursing simulations', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class CreateProgramDto {
  @ApiProperty({ example: 'department-cuid-123' })
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @ApiProperty({ example: 'Bachelor of Science in Nursing (BSN Generic)' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'BSN-GEN' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  durationYears?: number;

  @ApiProperty({ example: 135, required: false })
  @IsOptional()
  @IsNumber()
  totalCredits?: number;
}

class CreateSessionDto {
  @ApiProperty({ example: 'Academic Year 2026-2027' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '2026-09-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2027-08-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

class CreateSemesterDto {
  @ApiProperty({ example: 'session-cuid-123' })
  @IsNotEmpty()
  @IsString()
  academicSessionId: string;

  @ApiProperty({ example: 'program-cuid-123' })
  @IsNotEmpty()
  @IsString()
  programId: string;

  @ApiProperty({ example: 'Semester 1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  number: number;

  @ApiProperty({ enum: SemesterType, example: SemesterType.FALL })
  @IsEnum(SemesterType)
  type: SemesterType;

  @ApiProperty({ enum: SemesterStatus, example: SemesterStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(SemesterStatus)
  status?: SemesterStatus;
}

class CreateSubjectDto {
  @ApiProperty({ example: 'department-cuid-123' })
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @ApiProperty({ example: 'program-cuid-123', required: false })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiProperty({ example: 'Adult Health Nursing I' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'NUR-201' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  creditHours: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  theoryHours?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  practicalHours?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isClinical?: boolean;
}

class AssignSemesterSubjectDto {
  @ApiProperty({ example: 'subject-cuid-123' })
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;
}

class CreateClassSectionDto {
  @ApiProperty({ example: 'session-cuid-123' })
  @IsNotEmpty()
  @IsString()
  academicSessionId: string;

  @ApiProperty({ example: 'semester-cuid-123' })
  @IsNotEmpty()
  @IsString()
  semesterId: string;

  @ApiProperty({ example: 'BSN-Y1-SecA' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'room-cuid-123', required: false })
  @IsOptional()
  @IsString()
  roomId?: string;

  @ApiProperty({ example: 45, required: false })
  @IsOptional()
  @IsNumber()
  capacity?: number;
}

class AssignFacultyClassDto {
  @ApiProperty({ example: 'subject-cuid-123' })
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiProperty({ example: 'faculty-cuid-123', required: false })
  @IsOptional()
  @IsString()
  facultyId?: string;
}

class CreateTimetableSlotDto {
  @ApiProperty({ example: 'class-cuid-123' })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({ example: 'class-subject-cuid-123' })
  @IsNotEmpty()
  @IsString()
  classSubjectId: string;

  @ApiProperty({ example: 1, description: '1 = Monday, 2 = Tuesday, etc.' })
  @IsNumber()
  dayOfWeek: number;

  @ApiProperty({ example: '09:00' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ example: '10:30' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ example: 'room-cuid-123', required: false })
  @IsOptional()
  @IsString()
  roomId?: string;
}

@ApiTags('Academic Management & Curriculum')
@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  // ----------------------------------------------------
  // CAMPUSES & ROOMS
  // ----------------------------------------------------

  @Get('campuses')
  @ApiOperation({ summary: 'List campuses and physical infrastructure' })
  getCampuses() {
    return this.academicService.getCampuses();
  }

  @Post('campuses')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('system.settings.manage')
  @Audited({ entity: 'Campus', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a new campus' })
  createCampus(@Body() dto: CreateCampusDto) {
    return this.academicService.createCampus(dto);
  }

  @Post('buildings')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('system.settings.manage')
  @Audited({ entity: 'Building', action: 'CREATE' })
  @ApiOperation({ summary: 'Add a building block to a campus' })
  createBuilding(@Body() dto: CreateBuildingDto) {
    return this.academicService.createBuilding(dto);
  }

  @Get('rooms')
  @ApiOperation({ summary: 'List classrooms, laboratories, and simulation skills rooms' })
  @ApiQuery({ name: 'buildingId', required: false })
  @ApiQuery({ name: 'type', enum: RoomType, required: false })
  getRooms(@Query('buildingId') buildingId?: string, @Query('type') type?: RoomType) {
    return this.academicService.getRooms(buildingId, type);
  }

  @Post('rooms')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('system.settings.manage')
  @Audited({ entity: 'Room', action: 'CREATE' })
  @ApiOperation({ summary: 'Add a room / lab to a building' })
  createRoom(@Body() dto: CreateRoomDto) {
    return this.academicService.createRoom(dto);
  }

  // ----------------------------------------------------
  // DEPARTMENTS & PROGRAMS
  // ----------------------------------------------------

  @Get('departments')
  @ApiOperation({ summary: 'List academic and clinical departments' })
  getDepartments() {
    return this.academicService.getDepartments();
  }

  @Post('departments')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('academic.department.create')
  @Audited({ entity: 'Department', action: 'CREATE' })
  @ApiOperation({ summary: 'Create an academic department' })
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.academicService.createDepartment(dto);
  }

  @Get('programs')
  @ApiOperation({ summary: 'List degree programs (BSN, Post-RN, DPT, MLT)' })
  @ApiQuery({ name: 'departmentId', required: false })
  getPrograms(@Query('departmentId') departmentId?: string) {
    return this.academicService.getPrograms(departmentId);
  }

  @Post('programs')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('academic.program.create')
  @Audited({ entity: 'Program', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a new degree program' })
  createProgram(@Body() dto: CreateProgramDto) {
    return this.academicService.createProgram(dto);
  }

  // ----------------------------------------------------
  // SESSIONS & SEMESTERS
  // ----------------------------------------------------

  @Get('sessions')
  @ApiOperation({ summary: 'List academic sessions (e.g. Fall 2026, 2026-2027)' })
  getSessions() {
    return this.academicService.getSessions();
  }

  @Post('sessions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('academic.session.manage')
  @Audited({ entity: 'AcademicSession', action: 'CREATE' })
  @ApiOperation({ summary: 'Create an academic session' })
  createSession(@Body() dto: CreateSessionDto) {
    return this.academicService.createSession({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  @Get('semesters')
  @ApiOperation({ summary: 'List semesters by program or academic session' })
  @ApiQuery({ name: 'programId', required: false })
  @ApiQuery({ name: 'sessionId', required: false })
  getSemesters(@Query('programId') programId?: string, @Query('sessionId') sessionId?: string) {
    return this.academicService.getSemesters(programId, sessionId);
  }

  @Post('semesters')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('academic.session.manage')
  @Audited({ entity: 'Semester', action: 'CREATE' })
  @ApiOperation({ summary: 'Add a semester to an academic session and degree program' })
  createSemester(@Body() dto: CreateSemesterDto) {
    return this.academicService.createSemester(dto);
  }

  // ----------------------------------------------------
  // SUBJECTS & CURRICULUM
  // ----------------------------------------------------

  @Get('subjects')
  @ApiOperation({ summary: 'List courses, subjects, and clinical theory/practical credit hours' })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'programId', required: false })
  getSubjects(@Query('departmentId') departmentId?: string, @Query('programId') programId?: string) {
    return this.academicService.getSubjects(departmentId, programId);
  }

  @Post('subjects')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('academic.program.create')
  @Audited({ entity: 'Subject', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a new course / subject' })
  createSubject(@Body() dto: CreateSubjectDto) {
    return this.academicService.createSubject(dto);
  }

  @Post('semesters/:semesterId/subjects')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('academic.session.manage')
  @Audited({ entity: 'SemesterSubject', action: 'CREATE' })
  @ApiOperation({ summary: 'Map a subject into a semester curriculum syllabus' })
  @ApiParam({ name: 'semesterId', description: 'Semester UUID' })
  assignSemesterSubject(
    @Param('semesterId') semesterId: string,
    @Body() dto: AssignSemesterSubjectDto,
  ) {
    return this.academicService.assignSubjectToSemester(semesterId, dto.subjectId, dto.isMandatory);
  }

  // ----------------------------------------------------
  // CLASS SECTIONS & TIMETABLES
  // ----------------------------------------------------

  @Get('classes')
  @ApiOperation({ summary: 'List class sections, enrolled student counts, and course instructors' })
  @ApiQuery({ name: 'semesterId', required: false })
  @ApiQuery({ name: 'sessionId', required: false })
  getClasses(@Query('semesterId') semesterId?: string, @Query('sessionId') sessionId?: string) {
    return this.academicService.getClasses(semesterId, sessionId);
  }

  @Post('classes')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('academic.session.manage')
  @Audited({ entity: 'ClassSection', action: 'CREATE' })
  @ApiOperation({ summary: 'Create a class section cohort' })
  createClass(@Body() dto: CreateClassSectionDto) {
    return this.academicService.createClass(dto);
  }

  @Post('classes/:classId/assign-faculty')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('faculty.update')
  @Audited({ entity: 'ClassSubject', action: 'CREATE' })
  @ApiOperation({ summary: 'Assign a faculty instructor to teach a subject for a class section' })
  @ApiParam({ name: 'classId', description: 'Class section UUID' })
  assignFaculty(
    @Param('classId') classId: string,
    @Body() dto: AssignFacultyClassDto,
  ) {
    return this.academicService.assignFacultyToClassSubject(classId, dto.subjectId, dto.facultyId);
  }

  @Post('timetables')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('academic.session.manage')
  @Audited({ entity: 'Timetable', action: 'CREATE' })
  @ApiOperation({ summary: 'Schedule a lecture or lab timetable slot (with room clash validation)' })
  createTimetableSlot(@Body() dto: CreateTimetableSlotDto) {
    return this.academicService.createTimetableSlot(dto);
  }
}
