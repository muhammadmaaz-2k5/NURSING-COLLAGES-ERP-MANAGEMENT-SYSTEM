export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type CertificateType =
  | 'DEGREE'
  | 'DIPLOMA'
  | 'TRANSCRIPT'
  | 'COURSE_COMPLETION'
  | 'CLINICAL_HONOR';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  authorName?: string;
  publishedAt?: string;
  status: ContentStatus;
  createdAt: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  attachmentUrl?: string;
  isPublished: boolean;
  category?: string;
  publishedAt: string;
  expiryDate?: string;
}

export interface PortalEvent {
  id: string;
  title: string;
  slug: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  isPublished: boolean;
}

export interface PublicProgram {
  id: string;
  name: string;
  code: string;
  durationYears: number;
  totalSemesters: number;
  annualTuitionFee: number;
  eligibilityCriteria?: string;
  description?: string;
}

export interface AdmissionApplication {
  id: string;
  referenceNo: string;
  programId: string;
  programName: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  cnic?: string;
  previousInstitute?: string;
  marksObtained?: number;
  totalMarks?: number;
  percentage?: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENT_VERIFICATION' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
}

export interface VerificationData {
  isValid: boolean;
  certificateNo?: string;
  studentName?: string;
  studentRegId?: string;
  programName?: string;
  issueDate?: string;
  certificateType?: CertificateType;
  cgpa?: number;
  verificationHash?: string;
  error?: string;
}

export interface PortalOverviewData {
  publishedNewsCount: number;
  activeNoticesCount: number;
  upcomingEventsCount: number;
  activeProgramsCount: number;
  pendingAdmissionsCount: number;
  verificationsCount: number;
}

export interface CreateNewsDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  status?: ContentStatus;
}

export interface CreateNoticeDto {
  title: string;
  content: string;
  attachmentUrl?: string;
  isPublished?: boolean;
}

export interface CreateEventDto {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
}

export interface PublicAdmissionDto {
  programId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  cnic?: string;
  previousInstitute?: string;
  marksObtained?: number;
  totalMarks?: number;
  notes?: string;
}
