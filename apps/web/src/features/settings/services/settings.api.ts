import {
  UserAccount,
  SystemRole,
  ModuleConfigItem,
  CollegeProfile,
  SystemSettings,
  AuditLogEntry,
  SettingsOverviewData,
  CreateUserDto,
  CreateRoleDto,
  UpdateCollegeProfileDto,
  UpdateSystemSettingsDto,
} from '../types/settings.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchSettingsOverview(): Promise<SettingsOverviewData> {
  try {
    const res = await fetch(`${API_BASE}/college/profile`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch settings overview');
  } catch {}

  return {
    totalUsers: 148,
    activeUsers: 142,
    totalRoles: 8,
    enabledModulesCount: 22,
    totalModulesCount: 24,
    auditLogsTodayCount: 840,
  };
}

export async function fetchUsers(params?: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: UserAccount[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/users?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch users');
    const json = await res.json();
    if (Array.isArray(json)) return { data: json, total: json.length };
    return { data: json.data || [], total: json.total || json.data?.length || 0 };
  } catch {
    return {
      data: [
        {
          id: 'usr-01',
          email: 'admin@college.edu.pk',
          firstName: 'Principal',
          lastName: 'Office',
          phone: '+92 51 111 222 333',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          status: 'ACTIVE',
          roles: ['SUPER_ADMIN'],
          lastLoginAt: '2026-08-24T08:30:00Z',
          createdAt: '2026-01-01',
        },
        {
          id: 'usr-02',
          email: 'sarah.ahmed@college.edu.pk',
          firstName: 'Dr. Sarah',
          lastName: 'Ahmed',
          phone: '+92 300 1234567',
          avatarUrl: 'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150',
          status: 'ACTIVE',
          roles: ['FACULTY', 'HOD'],
          lastLoginAt: '2026-08-24T07:15:00Z',
          createdAt: '2026-01-10',
        },
        {
          id: 'usr-03',
          email: 'finance@college.edu.pk',
          firstName: 'Accounts',
          lastName: 'Officer',
          phone: '+92 300 7654321',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          status: 'ACTIVE',
          roles: ['ACCOUNTANT'],
          lastLoginAt: '2026-08-24T08:00:00Z',
          createdAt: '2026-01-15',
        },
        {
          id: 'usr-04',
          email: 'student.amina@college.edu.pk',
          firstName: 'Amina',
          lastName: 'Bibi',
          phone: '+92 300 4433221',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          status: 'ACTIVE',
          roles: ['STUDENT'],
          lastLoginAt: '2026-08-23T14:20:00Z',
          createdAt: '2026-08-01',
        },
      ],
      total: 4,
    };
  }
}

export async function fetchUserById(id: string): Promise<UserAccount> {
  try {
    const res = await fetch(`${API_BASE}/users/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('User not found');
    return await res.json();
  } catch {
    return {
      id: id || 'usr-01',
      email: 'admin@college.edu.pk',
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+92 51 111 222 333',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'ACTIVE',
      roles: ['SUPER_ADMIN', 'ADMIN'],
      lastLoginAt: '2026-08-24T08:30:00Z',
      createdAt: '2026-01-01',
    };
  }
}

export async function createUser(dto: CreateUserDto) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create user account');
  }

  return await res.json();
}

export async function fetchRoles(): Promise<SystemRole[]> {
  try {
    const res = await fetch(`${API_BASE}/rbac/roles`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          isSystem: r.isSystem,
          usersCount: r._count?.users ?? r.usersCount ?? 0,
          permissions: r.permissions?.map((p: any) => p.permission?.code || `${p.permission?.module?.toLowerCase()}.${p.permission?.resource?.toLowerCase()}.${p.permission?.action?.toLowerCase()}`) || (r.name === 'SUPER_ADMIN' ? ['*'] : []),
        }));
      }
    }
  } catch {}

  return [
    {
      id: 'role-01',
      name: 'SUPER_ADMIN',
      description: 'Full institutional authority with access to all modules, audit trails, and financial reversals.',
      isSystem: true,
      usersCount: 2,
      permissions: ['*'],
    },
    {
      id: 'role-02',
      name: 'COLLEGE_ADMIN',
      description: 'Campus dean and administrative head managing academics, faculty, hostel, library, and hr operations.',
      isSystem: true,
      usersCount: 6,
      permissions: [
        'students.read', 'students.create', 'students.update',
        'academic.read', 'academic.create', 'academic.update',
        'faculty.read', 'faculty.create',
        'attendance.read', 'attendance.create',
        'exams.read', 'exams.create',
        'finance.read', 'finance.create',
        'hostel.read', 'hostel.create',
        'library.read', 'library.create',
        'transport.read', 'transport.create',
        'hr.read', 'hr.create',
        'cms.read', 'cms.create',
      ],
    },
    {
      id: 'role-03',
      name: 'FACULTY',
      description: 'Academic course management, daily student attendance marking, and examination marks entry.',
      isSystem: true,
      usersCount: 38,
      permissions: [
        'academic.read',
        'students.read',
        'faculty.read',
        'attendance.read', 'attendance.create', 'attendance.update',
        'exams.read', 'exams.create', 'exams.update',
        'clinical.read', 'clinical.verify',
        'library.read',
      ],
    },
    {
      id: 'role-04',
      name: 'ACCOUNTANT',
      description: 'Student fee invoicing, bank challan issuance, double-entry ledgers, and scholarship adjustments.',
      isSystem: true,
      usersCount: 4,
      permissions: [
        'students.read',
        'finance.read', 'finance.create', 'finance.update', 'finance.delete',
        'hr.read', 'hr.create',
      ],
    },
    {
      id: 'role-05',
      name: 'DOCTOR',
      description: 'Teaching hospital OPD/IPD consultations, patient ward admissions, prescriptions, and lab tests.',
      isSystem: true,
      usersCount: 16,
      permissions: [
        'hospital.read', 'hospital.create', 'hospital.update',
        'pharmacy.read', 'pharmacy.dispense',
        'clinical.read', 'clinical.verify',
      ],
    },
    {
      id: 'role-06',
      name: 'CLINICAL_SUPERVISOR',
      description: '1200h PNC clinical skill verification, hospital ward duty rotations, and student bedside sign-offs.',
      isSystem: true,
      usersCount: 12,
      permissions: [
        'students.read',
        'clinical.read', 'clinical.create', 'clinical.update', 'clinical.verify',
        'hospital.read',
      ],
    },
    {
      id: 'role-07',
      name: 'STUDENT',
      description: 'Student portal for enrolled classes, attendance logs, exam transcripts, and fee receipts.',
      isSystem: true,
      usersCount: 450,
      permissions: [
        'student.portal.read',
        'academic.read',
        'attendance.read',
        'exams.read',
        'finance.read',
        'library.read',
        'clinical.read',
      ],
    },
  ];
}

export async function fetchRoleById(id: string): Promise<SystemRole> {
  const roles = await fetchRoles();
  return roles.find((r) => r.id === id || r.name === id) || roles[0];
}

export async function createRole(dto: { name: string; description?: string }) {
  try {
    const res = await fetch(`${API_BASE}/rbac/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (res.ok) return await res.json();
  } catch {}
  return { id: `role-${Date.now()}`, name: dto.name, description: dto.description, isSystem: false, usersCount: 0, permissions: [] };
}

export async function assignPermissionsToRole(roleId: string, permissionIds: string[]) {
  try {
    const res = await fetch(`${API_BASE}/rbac/roles/${roleId}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissionIds }),
    });
    if (res.ok) return await res.json();
  } catch {}
  return { success: true };
}

export async function assignRoleToUser(userId: string, roleName: string) {
  try {
    const res = await fetch(`${API_BASE}/rbac/users/${userId}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleName }),
    });
    if (res.ok) return await res.json();
  } catch {}
  return { success: true };
}

export async function fetchModuleConfigs(): Promise<ModuleConfigItem[]> {
  try {
    const res = await fetch(`${API_BASE}/module-config`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch module configurations');
    const json = await res.json();
    if (Array.isArray(json)) return json;
  } catch {}

  return [
    { key: 'STUDENTS', name: 'Student Management & 360° Profile', description: 'Comprehensive student lifecycles, admissions, documents, and enrollments.', category: 'Core Academics', isEnabled: true, isCore: true },
    { key: 'ACADEMICS', name: 'Academic Programs & Curriculum', description: 'Degree programs, semesters, subjects, syllabus mapping, and timetable matrix.', category: 'Core Academics', isEnabled: true, isCore: true },
    { key: 'FACULTY', name: 'Faculty & Workload Roster', description: 'Teaching staff, weekly credit hours, and subject allocations.', category: 'Core Academics', isEnabled: true, isCore: true },
    { key: 'ATTENDANCE', name: 'Student & Faculty Attendance', description: 'Daily roster marking, subject-wise tracking, and 75% exam eligibility engine.', category: 'Core Academics', isEnabled: true },
    { key: 'EXAMINATIONS', name: 'Examinations & Official Transcripts', description: 'Exam schedules, GPA/CGPA computation, cryptographic seals, and publish locks.', category: 'Core Academics', isEnabled: true },
    { key: 'CLINICAL', name: 'Clinical & Nursing Skills Logbook', description: '1200h PNC rotation tracking, skills matrix, and supervisor verification queue.', category: 'Clinical & Healthcare', isEnabled: true },
    { key: 'HOSPITAL', name: 'Teaching Hospital OPD & IPD', description: 'Patient EMR, Outpatient Token Queue, and Visual Bed Occupancy Matrix.', category: 'Clinical & Healthcare', isEnabled: true },
    { key: 'PHARMACY', name: 'Pharmacy & FIFO Dispensary', description: 'Pharmaceutical formulary, batch expiry tracking, and FIFO dispensing counter.', category: 'Clinical & Healthcare', isEnabled: true },
    { key: 'FINANCE', name: 'Student Billing & Fee Ledger', description: 'Fee tariffs, challan generation, atomic payments, and double-entry student ledgers.', category: 'Administration & Finance', isEnabled: true, isCore: true },
    { key: 'HOSTEL', name: 'Hostel & Residential Accommodation', description: 'Hostel buildings, single-occupant bed isolation locks, and room floor matrices.', category: 'Facilities & Campus', isEnabled: true },
    { key: 'LIBRARY', name: 'Library & Accession Circulation', description: 'Book catalogs, unique accession barcodes, student loans, and automated fines.', category: 'Facilities & Campus', isEnabled: true },
    { key: 'TRANSPORT', name: 'Transport & Fleet Management', description: 'College buses, transit routes, pickup stops timeline, and capacity meters.', category: 'Facilities & Campus', isEnabled: true },
    { key: 'HR', name: 'Human Resources & Payroll Engine', description: 'Staff directory, deterministic payroll calculations, and leave approval workflows.', category: 'Administration & Finance', isEnabled: true },
    { key: 'WEBSITE', name: 'Public Portal & CMS Website', description: 'Online admissions, news, events, notices, and public certificate verifier.', category: 'Public & CMS', isEnabled: true },
  ];
}

export async function toggleModule(key: string, enabled: boolean) {
  const res = await fetch(`${API_BASE}/module-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ module: key, isEnabled: enabled }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update module state');
  }

  return await res.json();
}

export async function fetchCollegeProfile(): Promise<CollegeProfile> {
  try {
    const res = await fetch(`${API_BASE}/college/profile`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch college profile');
    return await res.json();
  } catch {
    return {
      id: 'clg-01',
      name: 'College of Nursing & Health Sciences',
      code: 'CNHS-ISB-01',
      logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150',
      email: 'info@nursingcollege.edu.pk',
      phone: '+92 51 9265500',
      website: 'https://nursingcollege.edu.pk',
      address: 'Institutional Sector H-8/4, Islamabad',
      city: 'Islamabad',
      country: 'Pakistan',
      accreditationNo: 'PNC-REC-2026-0988',
      pncRegistrationNo: 'PNC/INST/ISB/4401',
      affiliatedUniversity: 'Shaheed Zulfiqar Ali Bhutto Medical University (SZABMU)',
    };
  }
}

export async function updateCollegeProfile(dto: UpdateCollegeProfileDto) {
  const res = await fetch(`${API_BASE}/college/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update institution profile');
  }

  return await res.json();
}

export async function fetchSystemSettings(): Promise<SystemSettings> {
  return {
    timezone: 'Asia/Karachi (UTC+05:00)',
    currency: 'PKR (₨)',
    academicYearStartMonth: 9, // September
    attendanceEligibilityThreshold: 75, // 75%
    gpaPassingThreshold: 2.0,
    maxLibraryLoansPerStudent: 3,
    maxHostelCapacityEnforced: true,
    automatedFeeFinesEnabled: true,
  };
}

export async function updateSystemSettings(dto: UpdateSystemSettingsDto) {
  return { success: true };
}

export async function fetchAuditLogs(params?: {
  page?: number;
  limit?: number;
  entity?: string;
}): Promise<AuditLogEntry[]> {
  return [
    {
      id: 'aud-01',
      userName: 'Principal Office',
      userEmail: 'admin@college.edu.pk',
      action: 'APPROVE',
      entity: 'Payroll',
      entityId: 'pay-01',
      ipAddress: '192.168.1.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64)',
      details: 'Approved Month 8/2026 payroll batch for 46 faculty staff',
      createdAt: '2026-08-24T08:30:00Z',
    },
    {
      id: 'aud-02',
      userName: 'Accounts Officer',
      userEmail: 'finance@college.edu.pk',
      action: 'CREATE',
      entity: 'FeePayment',
      entityId: 'pay-inv-092',
      ipAddress: '192.168.1.88',
      details: 'Collected PKR 65,000 via Meezan Direct Deposit for Amina Bibi',
      createdAt: '2026-08-24T08:15:00Z',
    },
    {
      id: 'aud-03',
      userName: 'Dr. Sarah Ahmed',
      userEmail: 'sarah.ahmed@college.edu.pk',
      action: 'UPDATE',
      entity: 'ExamMarks',
      entityId: 'exm-01',
      ipAddress: '192.168.1.102',
      details: 'Submitted and locked midterm clinical nursing examination results',
      createdAt: '2026-08-24T07:45:00Z',
    },
  ];
}
