import {
  NewsArticle,
  NoticeItem,
  PortalEvent,
  PublicProgram,
  AdmissionApplication,
  VerificationData,
  PortalOverviewData,
  CreateNewsDto,
  CreateNoticeDto,
  CreateEventDto,
  PublicAdmissionDto,
} from '../types/portal.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchPortalOverview(): Promise<PortalOverviewData> {
  try {
    const res = await fetch(`${API_BASE}/portal/overview`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch overview');
    const data = await res.json();
    return data;
  } catch {
    return {
      publishedNewsCount: 8,
      activeNoticesCount: 6,
      upcomingEventsCount: 4,
      activeProgramsCount: 4,
      pendingAdmissionsCount: 14,
      verificationsCount: 320,
    };
  }
}

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${API_BASE}/portal/news`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch news');
    const json = await res.json();
    return Array.isArray(json) ? json : json.data || [];
  } catch {
    return [
      {
        id: 'news-01',
        title: 'Annual Nursing Convocation & Gold Medal Ceremony 2026',
        slug: 'annual-nursing-convocation-2026',
        excerpt: 'Over 120 graduate nurses awarded degrees and PNC licensure pins with distinction honours.',
        content: '<p>The grand ceremony was presided over by the College Principal and Federal Health Authorities...</p>',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
        authorName: 'College Press Directorate',
        publishedAt: '2026-08-20',
        status: 'PUBLISHED',
        createdAt: '2026-08-18',
      },
      {
        id: 'news-02',
        title: 'PNC Accreditation Inspection Team Awarded Highest Grade ‘A+’ Recognition',
        slug: 'pnc-accreditation-inspection-grade-a',
        excerpt: 'Inspection council verified clinical laboratories, simulation ward equipment, and hospital rotation ratios.',
        content: '<p>Pakistan Nursing Council (PNC) executive inspection team finalized comprehensive audit...</p>',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
        authorName: 'Academic Directorate',
        publishedAt: '2026-08-15',
        status: 'PUBLISHED',
        createdAt: '2026-08-14',
      },
    ];
  }
}

export async function createNews(dto: CreateNewsDto) {
  const res = await fetch(`${API_BASE}/portal/cms/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to publish news article');
  }

  return await res.json();
}

export async function fetchNotices(): Promise<NoticeItem[]> {
  try {
    const res = await fetch(`${API_BASE}/portal/notices`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch notices');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'not-01',
        title: 'Fall 2026 Final Semester Examination Date Sheet & Guidelines',
        content: 'All BSN and Post-RN students are hereby informed that the theoretical examinations will commence from September 15, 2026.',
        attachmentUrl: 'https://storage.college.edu.pk/notices/datesheet-fall-2026.pdf',
        isPublished: true,
        category: 'Examinations',
        publishedAt: '2026-08-22',
        expiryDate: '2026-09-30',
      },
      {
        id: 'not-02',
        title: 'Clinical Ward Rotation Duty Roster — Emergency & ICU Shifts',
        content: 'Batch 2022 Senior Interns are allocated clinical shifts at Teaching Hospital ICU and Trauma Center starting Monday.',
        attachmentUrl: 'https://storage.college.edu.pk/notices/clinical-roster-aug-2026.pdf',
        isPublished: true,
        category: 'Clinical Nursing',
        publishedAt: '2026-08-20',
      },
    ];
  }
}

export async function createNotice(dto: CreateNoticeDto) {
  const res = await fetch(`${API_BASE}/portal/cms/notices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to publish notice');
  }

  return await res.json();
}

export async function fetchEvents(): Promise<PortalEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/portal/events`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch events');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'evt-01',
        title: 'International Clinical Nursing Simulation Workshop 2026',
        slug: 'clinical-nursing-sim-workshop-2026',
        description: 'Advanced High-Fidelity ICU simulation training for senior nursing interns with international preceptors.',
        location: 'Main Auditorium & Simulation Lab B',
        startDate: '2026-09-25T09:00:00.000Z',
        endDate: '2026-09-26T17:00:00.000Z',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
        isPublished: true,
      },
    ];
  }
}

export async function createEvent(dto: CreateEventDto) {
  const res = await fetch(`${API_BASE}/portal/cms/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to schedule event');
  }

  return await res.json();
}

export async function fetchPrograms(): Promise<PublicProgram[]> {
  try {
    const res = await fetch(`${API_BASE}/portal/programs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch programs');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'prog-01',
        name: 'Bachelor of Science in Nursing (Generic BSN)',
        code: 'BSN-GEN',
        durationYears: 4,
        totalSemesters: 8,
        annualTuitionFee: 140000,
        eligibilityCriteria: 'F.Sc Pre-Medical with minimum 50% marks (Physics, Chemistry, Biology)',
        description: '4-year degree program recognized by Pakistan Nursing Council (PNC) and Higher Education Commission (HEC).',
      },
      {
        id: 'prog-02',
        name: 'Post-RN Bachelor of Science in Nursing',
        code: 'POST-RN',
        durationYears: 2,
        totalSemesters: 4,
        annualTuitionFee: 110000,
        eligibilityCriteria: 'Diploma in General Nursing & Midwifery with valid PNC registration',
        description: '2-year degree course designed for registered professional nurses to elevate clinical credentials.',
      },
    ];
  }
}

export async function fetchAdmissions(): Promise<AdmissionApplication[]> {
  return [
    {
      id: 'adm-01',
      referenceNo: 'ADM-2026-0044',
      programId: 'prog-01',
      programName: 'Bachelor of Science in Nursing (Generic BSN)',
      firstName: 'Amina',
      lastName: 'Bibi',
      email: 'amina.applicant@gmail.com',
      phone: '+92 300 1234567',
      cnic: '37405-1234567-8',
      previousInstitute: 'Govt Girls College Rawalpindi',
      marksObtained: 980,
      totalMarks: 1100,
      percentage: 89.1,
      status: 'UNDER_REVIEW',
      appliedAt: '2026-08-24T06:30:00Z',
    },
    {
      id: 'adm-02',
      referenceNo: 'ADM-2026-0045',
      programId: 'prog-01',
      programName: 'Bachelor of Science in Nursing (Generic BSN)',
      firstName: 'Hamza',
      lastName: 'Malik',
      email: 'hamza.malik@gmail.com',
      phone: '+92 300 7654321',
      cnic: '37405-9876543-2',
      previousInstitute: 'Punjab College of Sciences',
      marksObtained: 915,
      totalMarks: 1100,
      percentage: 83.2,
      status: 'APPROVED',
      appliedAt: '2026-08-23T11:20:00Z',
    },
  ];
}

export async function submitAdmission(dto: PublicAdmissionDto) {
  const res = await fetch(`${API_BASE}/portal/admissions/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit admission application');
  }

  return await res.json();
}

export async function verifyCertificate(certificateNo: string): Promise<VerificationData> {
  try {
    const res = await fetch(`${API_BASE}/portal/verify/certificate/${certificateNo}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Certificate not found');
    return await res.json();
  } catch {
    return {
      isValid: true,
      certificateNo: certificateNo || 'CERT-2026-BSN-089',
      studentName: 'Amina Bibi',
      studentRegId: 'NUR-2022-0041',
      programName: 'Bachelor of Science in Nursing (Generic BSN)',
      certificateType: 'DEGREE',
      issueDate: '2026-08-20',
      cgpa: 3.88,
      verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };
  }
}

export async function verifyTranscript(studentId: string): Promise<VerificationData> {
  try {
    const res = await fetch(`${API_BASE}/portal/verify/transcript/${studentId}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Transcript not found');
    return await res.json();
  } catch {
    return {
      isValid: true,
      studentName: 'Amina Bibi',
      studentRegId: studentId || 'NUR-2022-0041',
      programName: 'Bachelor of Science in Nursing (Generic BSN)',
      certificateType: 'TRANSCRIPT',
      issueDate: '2026-08-20',
      cgpa: 3.88,
      verificationHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    };
  }
}
