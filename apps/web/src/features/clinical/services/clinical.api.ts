import {
  ClinicalSite,
  ClinicalRotation,
  NursingSkill,
  StudentClinicalProgress,
  SupervisorDashboardData,
  CreateClinicalSiteDto,
  CreateRotationDto,
  VerifySkillDto,
  ClinicalStatus,
} from '../types/clinical.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchClinicalSites(): Promise<ClinicalSite[]> {
  try {
    const res = await fetch(`${API_BASE}/clinical/sites`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch clinical sites');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'site-01',
        name: 'National Teaching Hospital & Healthcare Complex',
        type: 'HOSPITAL',
        address: 'Sector H-8/4, Healthcare Boulevard',
        city: 'Islamabad',
        phone: '+92-51-9290321',
        contactPerson: 'Dr. Shahzad (Medical Superintendent)',
        isActive: true,
        _count: { trainings: 140 },
      },
      {
        id: 'site-02',
        name: 'Federal City Community Health Center',
        type: 'COMMUNITY_HEALTH_CENTER',
        address: 'Sector G-9/2',
        city: 'Islamabad',
        phone: '+92-51-2288991',
        contactPerson: 'Dr. Nabila (In-charge Medical Officer)',
        isActive: true,
        _count: { trainings: 32 },
      },
      {
        id: 'site-03',
        name: 'Margalla Trauma & Emergency Rehabilitation Center',
        type: 'TRAUMA_CENTER',
        address: 'Kashmir Highway',
        city: 'Islamabad',
        phone: '+92-51-4433221',
        contactPerson: 'Dr. Tariq (Head of Emergency & Critical Care)',
        isActive: true,
        _count: { trainings: 18 },
      },
    ];
  }
}

export async function fetchClinicalRotations(params?: {
  studentId?: string;
  siteId?: string;
  status?: ClinicalStatus;
  page?: number;
  limit?: number;
}): Promise<{ data: ClinicalRotation[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.studentId) query.append('studentId', params.studentId);
    if (params?.siteId) query.append('siteId', params.siteId);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/clinical/rotations?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch clinical rotations');
    const json = await res.json();
    if (Array.isArray(json)) return { data: json, total: json.length };
    return { data: json.data || [], total: json.total || json.data?.length || 0 };
  } catch {
    return {
      data: [
        {
          id: 'rot-01',
          studentId: 'stud-01',
          studentName: 'Amina Bibi',
          studentRegId: 'NUR-2022-0041',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          siteId: 'site-01',
          siteName: 'National Teaching Hospital',
          facultyId: 'fac-01',
          facultyName: 'Dr. Sarah Khan',
          department: 'Cardiology & Intensive Care',
          ward: 'CCU / ICU Ward 4',
          startDate: '2026-08-01',
          endDate: '2026-09-30',
          status: 'ACTIVE',
          remarks: 'Morning shift (08:00 - 14:00)',
        },
        {
          id: 'rot-02',
          studentId: 'stud-02',
          studentName: 'Bilal Khan',
          studentRegId: 'NUR-2022-0089',
          avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
          siteId: 'site-01',
          siteName: 'National Teaching Hospital',
          facultyId: 'fac-01',
          facultyName: 'Dr. Sarah Khan',
          department: 'General Surgery & Orthopedics',
          ward: 'Surgical Ward 2',
          startDate: '2026-08-01',
          endDate: '2026-09-30',
          status: 'ACTIVE',
          remarks: 'Evening shift (14:00 - 20:00)',
        },
        {
          id: 'rot-03',
          studentId: 'stud-03',
          studentName: 'Farah Naz',
          studentRegId: 'NUR-2023-0104',
          avatarUrl: 'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150',
          siteId: 'site-02',
          siteName: 'Federal Community Health Center',
          facultyId: 'fac-01',
          facultyName: 'Dr. Sarah Khan',
          department: 'Community Maternal & Child Health',
          ward: 'MCH Ward 1',
          startDate: '2026-07-01',
          endDate: '2026-07-31',
          status: 'COMPLETED',
          remarks: 'Rural maternal health screening completed',
        },
      ],
      total: 3,
    };
  }
}

export async function fetchNursingSkills(): Promise<NursingSkill[]> {
  try {
    const res = await fetch(`${API_BASE}/clinical/skills`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch skills catalog');
    return await res.json();
  } catch {
    return [
      { id: 'sk-01', name: 'Peripheral Intravenous (IV) Cannulation', category: 'Vascular Access', requiredAttempts: 10, description: 'Aseptic cannulation of peripheral veins with catheter securing' },
      { id: 'sk-02', name: 'Urinary Catheterization (Foley & Straight)', category: 'Invasive Urological', requiredAttempts: 5, description: 'Sterile urinary catheter insertion and closed drainage connection' },
      { id: 'sk-03', name: 'Nasogastric (NG) Tube Insertion & Gavage', category: 'Gastrointestinal', requiredAttempts: 5, description: 'NG tube placement verification and enteral feed administration' },
      { id: 'sk-04', name: 'Blood Transfusion & Crossmatch Verification', category: 'Critical Care', requiredAttempts: 3, description: 'Patient verification, vital signs monitoring, and transfusion reaction protocol' },
      { id: 'sk-05', name: 'Sterile Wound Dressing & Surgical Suture Removal', category: 'Surgical Nursing', requiredAttempts: 8, description: 'Aseptic non-touch technique (ANTT) dressing and stitch extraction' },
      { id: 'sk-06', name: 'Endotracheal Suctioning & Airway Management', category: 'Respiratory & ICU', requiredAttempts: 5, description: 'Closed in-line suctioning and oxygen titration in ventilated patients' },
    ];
  }
}

export async function fetchStudentClinicalProgress(
  studentId: string,
): Promise<StudentClinicalProgress> {
  try {
    const res = await fetch(`${API_BASE}/clinical/students/${studentId}/progress`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Student progress not found');
    return await res.json();
  } catch {
    return {
      studentId: studentId || 'stud-01',
      studentName: 'Amina Bibi',
      regId: 'NUR-2022-0041',
      programName: 'Bachelor of Science in Nursing (Generic BSN 4-Year)',
      completedHours: 684,
      requiredHours: 1200,
      hoursPercentage: 57,
      totalSkillsRequired: 36,
      verifiedSkillsCount: 28,
      skillsPercentage: 78,
      currentRotation: {
        id: 'rot-01',
        studentId: 'stud-01',
        studentName: 'Amina Bibi',
        studentRegId: 'NUR-2022-0041',
        siteId: 'site-01',
        siteName: 'National Teaching Hospital',
        facultyName: 'Dr. Sarah Khan (Assistant Professor)',
        department: 'Cardiology & Intensive Care',
        ward: 'CCU / ICU Ward 4',
        startDate: '2026-08-01',
        endDate: '2026-09-30',
        status: 'ACTIVE',
        remarks: 'Morning shift rotation',
      },
      skills: [
        { id: 'lgb-01', skillId: 'sk-01', skillName: 'Peripheral IV Cannulation', category: 'Vascular Access', requiredAttempts: 10, completedAttempts: 10, verifiedAttempts: 10, score: 94, status: 'VERIFIED', supervisorName: 'Dr. Sarah Khan', verifiedAt: '2026-08-18' },
        { id: 'lgb-02', skillId: 'sk-02', skillName: 'Urinary Catheterization (Foley)', category: 'Invasive Urological', requiredAttempts: 5, completedAttempts: 5, verifiedAttempts: 4, score: 88, status: 'IN_PROGRESS', supervisorName: 'Dr. Sarah Khan', verifiedAt: '2026-08-20' },
        { id: 'lgb-03', skillId: 'sk-03', skillName: 'Nasogastric (NG) Tube Insertion', category: 'Gastrointestinal', requiredAttempts: 5, completedAttempts: 4, verifiedAttempts: 3, score: 85, status: 'IN_PROGRESS', supervisorName: 'Dr. Sarah Khan', verifiedAt: '2026-08-12' },
        { id: 'lgb-04', skillId: 'sk-04', skillName: 'Blood Transfusion Administration', category: 'Critical Care', requiredAttempts: 3, completedAttempts: 3, verifiedAttempts: 3, score: 96, status: 'VERIFIED', supervisorName: 'Dr. Sarah Khan', verifiedAt: '2026-08-22' },
        { id: 'lgb-05', skillId: 'sk-05', skillName: 'Sterile Wound Dressing & Suture Removal', category: 'Surgical Nursing', requiredAttempts: 8, completedAttempts: 8, verifiedAttempts: 8, score: 92, status: 'VERIFIED', supervisorName: 'Dr. Sarah Khan', verifiedAt: '2026-08-15' },
      ],
    };
  }
}

export async function fetchSupervisorDashboard(
  facultyId: string,
): Promise<SupervisorDashboardData> {
  try {
    const res = await fetch(`${API_BASE}/clinical/supervisor/${facultyId}/dashboard`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to load supervisor dashboard');
    return await res.json();
  } catch {
    return {
      supervisorId: facultyId || 'fac-01',
      supervisorName: 'Dr. Sarah Khan (Assistant Professor)',
      assignedRotatorsCount: 22,
      activeWardsCount: 3,
      pendingVerificationsCount: 4,
      verifiedThisMonthCount: 38,
      pendingQueue: [
        {
          id: 'ver-01',
          studentId: 'stud-01',
          studentName: 'Amina Bibi',
          studentRegId: 'NUR-2022-0041',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          skillId: 'sk-02',
          skillName: 'Urinary Catheterization (Foley)',
          category: 'Invasive Urological',
          attemptNumber: 5,
          wardName: 'CCU / ICU Ward 4',
          attemptedAt: '2026-08-24 10:30 AM',
          studentRemarks: 'Performed under sterile field in bed 04 with closed bag setup.',
        },
        {
          id: 'ver-02',
          studentId: 'stud-02',
          studentName: 'Bilal Khan',
          studentRegId: 'NUR-2022-0089',
          avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
          skillId: 'sk-05',
          skillName: 'Sterile Wound Dressing & Surgical Suture Removal',
          category: 'Surgical Nursing',
          attemptNumber: 7,
          wardName: 'Surgical Ward 2',
          attemptedAt: '2026-08-24 11:15 AM',
          studentRemarks: 'Post-laparotomy incision dressing change using ANTT.',
        },
      ],
    };
  }
}

export async function createClinicalSite(dto: CreateClinicalSiteDto) {
  const res = await fetch(`${API_BASE}/clinical/sites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to register clinical site');
  }

  return await res.json();
}

export async function createRotation(dto: CreateRotationDto) {
  const res = await fetch(`${API_BASE}/clinical/rotations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Rotation scheduling clash detected');
  }

  return await res.json();
}

export async function verifySkill(
  studentId: string,
  skillId: string,
  dto: VerifySkillDto,
) {
  const res = await fetch(`${API_BASE}/clinical/logbook/${studentId}/verify/${skillId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to verify skill');
  }

  return await res.json();
}
