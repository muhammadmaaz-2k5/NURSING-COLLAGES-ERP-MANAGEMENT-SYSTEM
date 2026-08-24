export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';

export interface StudentRosterAttendanceRecord {
  studentId: string;
  regId: string;
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  status: AttendanceStatus;
  remarks?: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  isEligibleForExam: boolean; // >= 75%
}

export interface MarkStudentRecordDto {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface MarkBatchAttendanceDto {
  classId: string;
  subjectId: string;
  date: string;
  records: MarkStudentRecordDto[];
}

export interface StudentAttendanceSessionRecord {
  id: string;
  date: string;
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface StudentAttendanceReport {
  studentId: string;
  studentName: string;
  regId: string;
  programName: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  attendancePercentage: number;
  isEligibleForExam: boolean; // >= 75%
  history: StudentAttendanceSessionRecord[];
}
