export type ExamType = 'QUIZ' | 'ASSIGNMENT' | 'MIDTERM' | 'FINAL' | 'CLINICAL_OSCE' | 'PRACTICAL';
export type ExamStatus = 'SCHEDULED' | 'ONGOING' | 'GRADING' | 'PUBLISHED' | 'CANCELLED';

export interface ExamSubject {
  id: string;
  name: string;
  code: string;
  creditHours: number;
}

export interface ExamSemester {
  id: string;
  name: string;
  program?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface ExamFaculty {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
}

export interface ExamItem {
  id: string;
  name: string;
  type: ExamType;
  status: ExamStatus;
  totalMarks: number;
  passingMarks: number;
  examDate?: string;
  startTime?: string;
  endTime?: string;
  roomName?: string;
  subject: ExamSubject;
  semester: ExamSemester;
  faculty?: ExamFaculty;
  _count?: {
    results: number;
  };
}

export interface StudentMarkRecord {
  studentId: string;
  regId: string;
  studentName: string;
  avatarUrl?: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  status: 'PASS' | 'FAIL';
  remarks?: string;
  isPublished: boolean;
}

export interface ExamDetail extends ExamItem {
  results: StudentMarkRecord[];
}

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

export interface TranscriptCourseItem {
  code: string;
  name: string;
  creditHours: number;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
  status: 'PASS' | 'FAIL';
}

export interface TranscriptSemesterBlock {
  semesterNumber: number;
  semesterName: string;
  courses: TranscriptCourseItem[];
  semesterGpa: number;
  totalCreditsEarned: number;
}

export interface StudentOfficialTranscript {
  studentId: string;
  regId: string;
  studentName: string;
  fatherName?: string;
  cnic?: string;
  programName: string;
  programCode: string;
  enrollmentDate: string;
  cumulativeCgpa: number;
  totalCreditsCompleted: number;
  academicStanding: 'GOOD_STANDING' | 'PROBATION' | 'GRADUATED';
  verificationHash: string;
  semesters: TranscriptSemesterBlock[];
}
