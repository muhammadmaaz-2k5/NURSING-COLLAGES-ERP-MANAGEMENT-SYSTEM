export type ClinicalSiteType = 'HOSPITAL' | 'COMMUNITY_HEALTH_CENTER' | 'CLINIC' | 'REHAB_CENTER' | 'TRAUMA_CENTER';
export type ClinicalStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type SkillStatus = 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED';

export interface ClinicalSite {
  id: string;
  name: string;
  type: ClinicalSiteType;
  address?: string;
  city?: string;
  phone?: string;
  contactPerson?: string;
  isActive: boolean;
  _count?: {
    trainings: number;
  };
}

export interface ClinicalRotation {
  id: string;
  studentId: string;
  studentName: string;
  studentRegId: string;
  avatarUrl?: string;
  siteId: string;
  siteName: string;
  facultyId?: string;
  facultyName?: string;
  department?: string;
  ward?: string;
  startDate: string;
  endDate: string;
  status: ClinicalStatus;
  remarks?: string;
}

export interface NursingSkill {
  id: string;
  name: string;
  code?: string;
  description?: string;
  category: string;
  requiredAttempts: number;
}

export interface StudentSkillLogbookEntry {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  requiredAttempts: number;
  completedAttempts: number;
  verifiedAttempts: number;
  score?: number;
  status: SkillStatus;
  supervisorName?: string;
  verifiedAt?: string;
  remarks?: string;
}

export interface StudentClinicalProgress {
  studentId: string;
  studentName: string;
  regId: string;
  programName: string;
  completedHours: number;
  requiredHours: number; // 1,200 standard PNC
  hoursPercentage: number;
  totalSkillsRequired: number;
  verifiedSkillsCount: number;
  skillsPercentage: number;
  currentRotation?: ClinicalRotation;
  skills: StudentSkillLogbookEntry[];
}

export interface SupervisorPendingVerification {
  id: string;
  studentId: string;
  studentName: string;
  studentRegId: string;
  avatarUrl?: string;
  skillId: string;
  skillName: string;
  category: string;
  attemptNumber: number;
  wardName: string;
  attemptedAt: string;
  studentRemarks?: string;
}

export interface SupervisorDashboardData {
  supervisorId: string;
  supervisorName: string;
  assignedRotatorsCount: number;
  activeWardsCount: number;
  pendingVerificationsCount: number;
  verifiedThisMonthCount: number;
  pendingQueue: SupervisorPendingVerification[];
}

export interface CreateClinicalSiteDto {
  name: string;
  type: ClinicalSiteType;
  address?: string;
  city?: string;
  phone?: string;
  contactPerson?: string;
}

export interface CreateRotationDto {
  studentId: string;
  siteId: string;
  facultyId?: string;
  department?: string;
  ward?: string;
  startDate: string;
  endDate: string;
  remarks?: string;
}

export interface VerifySkillDto {
  score?: number;
  status: SkillStatus;
  remarks?: string;
}
