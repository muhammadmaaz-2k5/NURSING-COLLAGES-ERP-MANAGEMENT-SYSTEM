import {
  Program,
  Department,
  Subject,
  Campus,
  AcademicSession,
  ClassSection,
  TimetableSlot,
  CreateProgramDto,
  CreateSubjectDto,
  CreateTimetableDto,
} from '../types/academic.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchPrograms(): Promise<Program[]> {
  try {
    const res = await fetch(`${API_BASE}/academic/programs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch programs');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'prog-01',
        departmentId: 'dept-01',
        name: 'Bachelor of Science in Nursing (Generic BSN)',
        code: 'BSN-GEN',
        durationYears: 4,
        totalCredits: 135,
        description: 'Comprehensive 4-Year nursing degree recognized by PNC and HEC',
        isActive: true,
        _count: { students: 360, subjects: 42 },
      },
      {
        id: 'prog-02',
        departmentId: 'dept-01',
        name: 'Post-RN BSN Degree Program',
        code: 'POST-RN',
        durationYears: 2,
        totalCredits: 68,
        description: 'Accelerated 2-Year clinical degree for registered diploma nurses',
        isActive: true,
        _count: { students: 90, subjects: 22 },
      },
      {
        id: 'prog-03',
        departmentId: 'dept-02',
        name: 'Doctor of Physical Therapy (DPT)',
        code: 'DPT-5YR',
        durationYears: 5,
        totalCredits: 175,
        description: '5-Year doctoral level rehabilitation and physical therapy program',
        isActive: true,
        _count: { students: 45, subjects: 50 },
      },
      {
        id: 'prog-04',
        departmentId: 'dept-02',
        name: 'BS Medical Laboratory Technology (BS-MLT)',
        code: 'BS-MLT',
        durationYears: 4,
        totalCredits: 132,
        description: 'Diagnostic pathology, hematology, and clinical microbiology program',
        isActive: true,
        _count: { students: 35, subjects: 38 },
      },
    ];
  }
}

export async function fetchDepartments(): Promise<Department[]> {
  try {
    const res = await fetch(`${API_BASE}/academic/departments`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch departments');
    return await res.json();
  } catch {
    return [
      {
        id: 'dept-01',
        name: 'Department of Nursing & Clinical Care',
        code: 'DEPT-NURSING',
        description: 'BSN, Post-RN and Clinical Nursing Practicum',
        _count: { programs: 2, faculty: 24 },
      },
      {
        id: 'dept-02',
        name: 'Department of Allied Health Sciences',
        code: 'DEPT-ALLIED',
        description: 'Physical Therapy, Medical Imaging & Laboratory Sciences',
        _count: { programs: 2, faculty: 14 },
      },
    ];
  }
}

export async function fetchCurriculum(programId?: string): Promise<Subject[]> {
  try {
    const query = programId ? `?programId=${programId}` : '';
    const res = await fetch(`${API_BASE}/academic/subjects${query}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch curriculum');
    return await res.json();
  } catch {
    return [
      // Semester 1
      { id: 'sub-01', programId: 'prog-01', name: 'Human Anatomy & Physiology I', code: 'ANAT-101', creditHours: 4, theoryHours: 3, practicalHours: 1, clinicalHours: 0, semesterNumber: 1 },
      { id: 'sub-02', programId: 'prog-01', name: 'Fundamentals of Nursing I', code: 'FON-101', creditHours: 5, theoryHours: 2, practicalHours: 1, clinicalHours: 2, semesterNumber: 1 },
      { id: 'sub-03', programId: 'prog-01', name: 'Microbiology for Healthcare', code: 'MIC-101', creditHours: 3, theoryHours: 2, practicalHours: 1, clinicalHours: 0, semesterNumber: 1 },
      { id: 'sub-04', programId: 'prog-01', name: 'Biochemistry in Clinical Health', code: 'BIO-101', creditHours: 3, theoryHours: 3, practicalHours: 0, clinicalHours: 0, semesterNumber: 1 },
      // Semester 2
      { id: 'sub-05', programId: 'prog-01', name: 'Human Anatomy & Physiology II', code: 'ANAT-102', creditHours: 4, theoryHours: 3, practicalHours: 1, clinicalHours: 0, semesterNumber: 2 },
      { id: 'sub-06', programId: 'prog-01', name: 'Fundamentals of Nursing II', code: 'FON-102', creditHours: 5, theoryHours: 2, practicalHours: 1, clinicalHours: 2, semesterNumber: 2 },
      { id: 'sub-07', programId: 'prog-01', name: 'Community Health Nursing I', code: 'CHN-102', creditHours: 3, theoryHours: 2, practicalHours: 0, clinicalHours: 1, semesterNumber: 2 },
      // Semester 6
      { id: 'sub-08', programId: 'prog-01', name: 'Adult Health Nursing II', code: 'AHN-302', creditHours: 5, theoryHours: 2, practicalHours: 1, clinicalHours: 2, semesterNumber: 6 },
      { id: 'sub-09', programId: 'prog-01', name: 'Clinical Pharmacology & Therapeutics', code: 'PHM-304', creditHours: 3, theoryHours: 3, practicalHours: 0, clinicalHours: 0, semesterNumber: 6 },
      { id: 'sub-10', programId: 'prog-01', name: 'Nursing Ethics & Professional Leadership', code: 'ETH-306', creditHours: 2, theoryHours: 2, practicalHours: 0, clinicalHours: 0, semesterNumber: 6 },
    ];
  }
}

export async function fetchCampuses(): Promise<Campus[]> {
  try {
    const res = await fetch(`${API_BASE}/academic/campuses`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch campuses');
    return await res.json();
  } catch {
    return [
      {
        id: 'camp-01',
        name: 'Main Healthcare City Campus',
        code: 'CAMP-MAIN',
        address: 'Healthcare Avenue, Sector H-8/4',
        city: 'Islamabad',
        phone: '+92-51-111-222-333',
        buildings: [
          {
            id: 'bld-01',
            campusId: 'camp-01',
            name: 'Nursing & Allied Sciences Block A',
            code: 'BLK-A',
            rooms: [
              { id: 'rm-101', buildingId: 'bld-01', name: 'Lecture Hall 101', roomNumber: 'LH-101', type: 'CLASSROOM', capacity: 60 },
              { id: 'rm-102', buildingId: 'bld-01', name: 'Lecture Hall 102', roomNumber: 'LH-102', type: 'CLASSROOM', capacity: 60 },
              { id: 'rm-lab1', buildingId: 'bld-01', name: 'Clinical Skills & Simulation Lab 1', roomNumber: 'SIM-LAB-1', type: 'CLINICAL_SIMULATION', capacity: 30 },
              { id: 'rm-lab2', buildingId: 'bld-01', name: 'Anatomy & Physiology Wet Lab', roomNumber: 'ANAT-LAB', type: 'LAB', capacity: 35 },
            ],
          },
          {
            id: 'bld-02',
            campusId: 'camp-01',
            name: 'Hospital Teaching Auditorium & Clinics',
            code: 'AUD-BLK',
            rooms: [
              { id: 'rm-aud', buildingId: 'bld-02', name: 'Florence Nightingale Grand Auditorium', roomNumber: 'AUD-01', type: 'AUDITORIUM', capacity: 250 },
            ],
          },
        ],
      },
    ];
  }
}

export async function fetchSessions(): Promise<AcademicSession[]> {
  try {
    const res = await fetch(`${API_BASE}/academic/sessions`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return await res.json();
  } catch {
    return [
      {
        id: 'sess-01',
        name: 'Academic Year 2026-2027',
        startDate: '2026-09-01',
        endDate: '2027-08-31',
        isActive: true,
        semesters: [
          { id: 'sem-01', academicSessionId: 'sess-01', programId: 'prog-01', name: 'Fall 2026 - Semester 1 & 6', semesterNumber: 1, type: 'FALL', status: 'ACTIVE', startDate: '2026-09-01', endDate: '2027-01-31' },
          { id: 'sem-02', academicSessionId: 'sess-01', programId: 'prog-01', name: 'Spring 2027 - Semester 2 & 7', semesterNumber: 2, type: 'SPRING', status: 'UPCOMING', startDate: '2027-02-15', endDate: '2027-06-30' },
          { id: 'sem-03', academicSessionId: 'sess-01', programId: 'prog-01', name: 'Summer Remedial 2027', semesterNumber: 3, type: 'SUMMER', status: 'UPCOMING', startDate: '2027-07-01', endDate: '2027-08-25' },
        ],
      },
    ];
  }
}

export async function fetchTimetable(classId?: string): Promise<TimetableSlot[]> {
  try {
    const query = classId ? `?classId=${classId}` : '';
    const res = await fetch(`${API_BASE}/academic/timetable${query}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch timetable');
    return await res.json();
  } catch {
    return [
      { id: 'slot-1', classId: 'cls-1', dayOfWeek: 1, startTime: '08:30', endTime: '10:00', subjectName: 'Fundamentals of Nursing II', subjectCode: 'FON-102', facultyName: 'Dr. Sarah Khan', roomName: 'Clinical Skills Lab 1', sectionName: 'BSN-SecA' },
      { id: 'slot-2', classId: 'cls-1', dayOfWeek: 1, startTime: '10:30', endTime: '12:00', subjectName: 'Human Anatomy & Physiology II', subjectCode: 'ANAT-102', facultyName: 'Dr. Tariq Mahmood', roomName: 'Lecture Hall 101', sectionName: 'BSN-SecA' },
      { id: 'slot-3', classId: 'cls-1', dayOfWeek: 2, startTime: '08:30', endTime: '11:30', subjectName: 'Hospital Clinical Rotation (Cardiology)', subjectCode: 'CLIN-301', facultyName: 'Dr. Sarah Khan', roomName: 'Teaching Hospital Ward 4', sectionName: 'BSN-SecA' },
      { id: 'slot-4', classId: 'cls-1', dayOfWeek: 3, startTime: '09:00', endTime: '10:30', subjectName: 'Clinical Pharmacology', subjectCode: 'PHM-304', facultyName: 'Dr. Usman Ali', roomName: 'Lecture Hall 102', sectionName: 'BSN-SecA' },
      { id: 'slot-5', classId: 'cls-1', dayOfWeek: 4, startTime: '11:00', endTime: '12:30', subjectName: 'Adult Health Nursing II', subjectCode: 'AHN-302', facultyName: 'Dr. Nabila Akram', roomName: 'Lecture Hall 101', sectionName: 'BSN-SecA' },
      { id: 'slot-6', classId: 'cls-1', dayOfWeek: 5, startTime: '09:00', endTime: '11:00', subjectName: 'Anatomy Wet Lab Practical', subjectCode: 'ANAT-102-L', facultyName: 'Dr. Tariq Mahmood', roomName: 'Anatomy Lab', sectionName: 'BSN-SecA' },
    ];
  }
}

export async function createTimetableSlot(dto: CreateTimetableDto) {
  const res = await fetch(`${API_BASE}/academic/timetable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Timetable scheduling conflict detected');
  }

  return await res.json();
}
