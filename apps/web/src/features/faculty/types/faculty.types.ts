export interface FacultyUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  status: string;
}

export interface FacultyDepartment {
  id: string;
  name: string;
  code: string;
}

export interface FacultyCampus {
  id: string;
  name: string;
  code: string;
}

export interface FacultyCourseAllocation {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  programName: string;
  semesterName: string;
  sectionName: string;
  theoryCredits: number;
  practicalCredits: number;
  clinicalCredits: number;
  totalCredits: number;
  studentCount: number;
}

export interface FacultyClinicalSupervision {
  id: string;
  rotationName: string;
  siteName: string;
  wardName: string;
  studentCount: number;
  activeStudents: number;
}

export interface FacultyWorkload {
  facultyId: string;
  facultyName: string;
  designation: string;
  theoryHours: number;
  practicalHours: number;
  clinicalHours: number;
  totalHours: number;
  maxRecommendedHours: number;
  isOverloaded: boolean;
  coursesCount: number;
  sectionsCount: number;
  totalStudents: number;
}

export interface FacultyMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  designation: string;
  qualification: string;
  specialization?: string;
  joiningDate?: string;
  department: FacultyDepartment;
  campus?: FacultyCampus;
  user: FacultyUser;
  workload: FacultyWorkload;
  courseAllocations: FacultyCourseAllocation[];
  supervisions: FacultyClinicalSupervision[];
}

export interface CreateFacultyDto {
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  departmentId: string;
  campusId?: string;
  designation: string;
  qualification: string;
  specialization?: string;
  phone?: string;
  joiningDate?: string;
}
