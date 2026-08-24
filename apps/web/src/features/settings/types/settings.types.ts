export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface UserAccount {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  status: UserStatus;
  roles: string[];
  lastLoginAt?: string;
  createdAt: string;
}

export interface PermissionMatrixRow {
  module: string;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface SystemRole {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  usersCount: number;
  permissions: string[];
}

export interface ModuleConfigItem {
  key: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
  icon?: string;
  isCore?: boolean;
}

export interface CollegeProfile {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  accreditationNo?: string;
  pncRegistrationNo?: string;
  affiliatedUniversity?: string;
}

export interface SystemSettings {
  timezone: string;
  currency: string;
  academicYearStartMonth: number;
  attendanceEligibilityThreshold: number; // e.g. 75%
  gpaPassingThreshold: number; // e.g. 2.0
  maxLibraryLoansPerStudent: number;
  maxHostelCapacityEnforced: boolean;
  automatedFeeFinesEnabled: boolean;
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'APPROVE' | 'REVERSE' | 'DISBURSE';
  entity: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  createdAt: string;
}

export interface SettingsOverviewData {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  enabledModulesCount: number;
  totalModulesCount: number;
  auditLogsTodayCount: number;
}

export interface CreateUserDto {
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  roleNames: string[];
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateCollegeProfileDto {
  name?: string;
  code?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  accreditationNo?: string;
  pncRegistrationNo?: string;
  affiliatedUniversity?: string;
}

export interface UpdateSystemSettingsDto {
  timezone?: string;
  currency?: string;
  attendanceEligibilityThreshold?: number;
  gpaPassingThreshold?: number;
  maxLibraryLoansPerStudent?: number;
  automatedFeeFinesEnabled?: boolean;
}
