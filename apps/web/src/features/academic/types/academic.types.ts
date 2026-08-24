export type RoomType = 'CLASSROOM' | 'LAB' | 'CLINICAL_SIMULATION' | 'AUDITORIUM' | 'CONFERENCE_ROOM';
export type SemesterType = 'FALL' | 'SPRING' | 'SUMMER';
export type SemesterStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  _count?: {
    programs: number;
    faculty: number;
  };
}

export interface Program {
  id: string;
  departmentId: string;
  department?: Department;
  name: string;
  code: string;
  durationYears: number;
  totalCredits: number;
  description?: string;
  isActive: boolean;
  _count?: {
    students: number;
    subjects: number;
  };
}

export interface Subject {
  id: string;
  programId: string;
  program?: Program;
  name: string;
  code: string;
  creditHours: number;
  theoryHours?: number;
  practicalHours?: number;
  clinicalHours?: number;
  semesterNumber?: number;
  description?: string;
}

export interface Room {
  id: string;
  buildingId: string;
  name: string;
  roomNumber?: string;
  type: RoomType;
  capacity?: number;
}

export interface Building {
  id: string;
  campusId: string;
  name: string;
  code?: string;
  rooms: Room[];
}

export interface Campus {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  phone?: string;
  buildings: Building[];
}

export interface Semester {
  id: string;
  academicSessionId: string;
  programId: string;
  name: string;
  semesterNumber: number;
  type: SemesterType;
  status: SemesterStatus;
  startDate: string;
  endDate: string;
  classes?: ClassSection[];
}

export interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  semesters: Semester[];
}

export interface ClassSection {
  id: string;
  academicSessionId: string;
  semesterId: string;
  name: string;
  capacity?: number;
  roomId?: string;
  room?: Room;
  _count?: {
    students: number;
  };
}

export interface TimetableSlot {
  id: string;
  classId: string;
  dayOfWeek: number; // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  startTime: string; // "08:30"
  endTime: string;   // "10:00"
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  roomName: string;
  sectionName: string;
}

export interface CreateProgramDto {
  departmentId: string;
  name: string;
  code: string;
  durationYears: number;
  totalCredits: number;
}

export interface CreateSubjectDto {
  programId: string;
  name: string;
  code: string;
  creditHours: number;
  theoryHours?: number;
  practicalHours?: number;
  clinicalHours?: number;
  semesterNumber?: number;
}

export interface CreateTimetableDto {
  classId: string;
  classSubjectId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  roomId?: string;
}
