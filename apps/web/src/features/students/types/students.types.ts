export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'DROPPED_OUT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type DocumentType = 'CNIC' | 'MATRIC_CERT' | 'FSC_CERT' | 'PNC_REG' | 'DOMICILE' | 'MEDICAL_FITNESS' | 'PHOTO' | 'OTHER';

export interface StudentUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  status: string;
}

export interface StudentProgram {
  id: string;
  name: string;
  code: string;
  durationYears: number;
  totalCredits: number;
}

export interface StudentParent {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  relationship: string;
  occupation?: string;
  isPrimary?: boolean;
}

export interface StudentDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface StudentEnrollment {
  id: string;
  semesterNumber: number;
  status: string;
  enrolledAt: string;
  semester?: {
    name: string;
    academicSession?: { name: string };
  };
  classSection?: {
    name: string;
  };
}

export interface StudentResult {
  id: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  status: 'PASS' | 'FAIL';
  exam: {
    name: string;
    type: string;
  };
  subject: {
    name: string;
    code: string;
    creditHours: number;
  };
}

export interface StudentAttendanceSummary {
  totalClasses: number;
  present: number;
  absent: number;
  leave: number;
  percentage: number;
}

export interface StudentClinicalSummary {
  completedHours: number;
  requiredHours: number;
  currentRotation?: {
    rotationName: string;
    siteName: string;
    wardName: string;
    startDate: string;
    endDate: string;
    supervisorName: string;
  };
  skills: {
    skillName: string;
    category: string;
    requiredAttempts: number;
    completedAttempts: number;
    verifiedAttempts: number;
  }[];
}

export interface StudentFeeLedgerItem {
  id: string;
  date: string;
  description: string;
  challanNo?: string;
  debit: number;
  credit: number;
  balance: number;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
}

export interface StudentSummaryItem {
  id: string;
  studentId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  cnic?: string;
  gender?: Gender;
  status: StudentStatus;
  program: StudentProgram;
  campusName?: string;
  currentSemester?: number;
  cgpa?: number;
  createdAt: string;
}

export interface StudentProfile360 extends StudentSummaryItem {
  user: StudentUser;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  parents: StudentParent[];
  documents: StudentDocument[];
  enrollments: StudentEnrollment[];
  results: StudentResult[];
  attendance: StudentAttendanceSummary;
  clinical: StudentClinicalSummary;
  feeLedger: {
    totalBilled: number;
    totalPaid: number;
    outstandingBalance: number;
    transactions: StudentFeeLedgerItem[];
  };
}

export interface CreateStudentDto {
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  programId: string;
  campusId?: string;
  cnic?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
}
