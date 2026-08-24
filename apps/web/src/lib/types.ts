export interface College {
  id: string;
  name: string;
  code: string;
  slug: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  city?: string;
  isActive: boolean;
  modules?: CollegeModule[];
  _count?: {
    students: number;
    faculty: number;
    departments: number;
    programs: number;
  };
}

export interface CollegeModule {
  id?: string;
  collegeId?: string;
  module: string;
  enabled: boolean;
  settings?: Record<string, any> | null;
  updatedAt?: string | null;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  programs?: Program[];
  _count?: {
    faculty: number;
    subjects: number;
  };
}

export interface Program {
  id: string;
  name: string;
  code: string;
  durationYears?: number;
  totalCredits?: number;
  department?: Department;
  _count?: {
    students: number;
    semesters: number;
    subjects: number;
  };
}

export interface AdmissionStats {
  total: number;
  pending: number;
  approved: number;
  enrolled: number;
}
