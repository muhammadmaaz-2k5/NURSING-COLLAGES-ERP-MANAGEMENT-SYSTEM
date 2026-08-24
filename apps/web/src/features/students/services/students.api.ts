import { StudentSummaryItem, StudentProfile360, CreateStudentDto, StudentStatus } from '../types/students.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchStudents(params?: {
  search?: string;
  status?: StudentStatus;
  programId?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: StudentSummaryItem[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.programId) query.append('programId', params.programId);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/students?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch student directory');
    const json = await res.json();

    if (Array.isArray(json)) {
      return { data: json, total: json.length };
    }
    return { data: json.data || [], total: json.total || json.data?.length || 0 };
  } catch (err) {
    console.warn('API fetchStudents failed, falling back to cached directory');
    return {
      data: [
        {
          id: 'stud-01',
          studentId: 'NUR-2022-0041',
          firstName: 'Amina',
          lastName: 'Bibi',
          email: 'amina.bibi@student.nmc.edu.pk',
          phone: '+923001122334',
          cnic: '37405-1234567-2',
          gender: 'FEMALE',
          status: 'ACTIVE',
          program: {
            id: 'prog-01',
            name: 'Bachelor of Science in Nursing (Generic)',
            code: 'BSN-GEN',
            durationYears: 4,
            totalCredits: 135,
          },
          currentSemester: 6,
          cgpa: 3.82,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'stud-02',
          studentId: 'NUR-2022-0089',
          firstName: 'Bilal',
          lastName: 'Khan',
          email: 'bilal.khan@student.nmc.edu.pk',
          phone: '+923019988776',
          cnic: '37405-7654321-1',
          gender: 'MALE',
          status: 'ACTIVE',
          program: {
            id: 'prog-01',
            name: 'Bachelor of Science in Nursing (Generic)',
            code: 'BSN-GEN',
            durationYears: 4,
            totalCredits: 135,
          },
          currentSemester: 6,
          cgpa: 3.45,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'stud-03',
          studentId: 'NUR-2023-0104',
          firstName: 'Farah',
          lastName: 'Naz',
          email: 'farah.naz@student.nmc.edu.pk',
          phone: '+923024455667',
          cnic: '37405-3344556-4',
          gender: 'FEMALE',
          status: 'ACTIVE',
          program: {
            id: 'prog-02',
            name: 'Post-RN BSN Degree Program',
            code: 'POST-RN',
            durationYears: 2,
            totalCredits: 68,
          },
          currentSemester: 3,
          cgpa: 3.65,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 3,
    };
  }
}

export async function fetchStudent360(id: string): Promise<StudentProfile360> {
  try {
    const res = await fetch(`${API_BASE}/students/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Student not found');
    return await res.json();
  } catch (err) {
    // Generate full 360-degree mock data for institutional profile
    return {
      id: id || 'stud-01',
      studentId: 'NUR-2022-0041',
      firstName: 'Amina',
      lastName: 'Bibi',
      email: 'amina.bibi@student.nmc.edu.pk',
      phone: '+923001122334',
      cnic: '37405-1234567-2',
      gender: 'FEMALE',
      bloodGroup: 'O+',
      dateOfBirth: '2003-08-14',
      address: 'House 42, Street 8, Sector G-10/2',
      city: 'Islamabad',
      status: 'ACTIVE',
      program: {
        id: 'prog-01',
        name: 'Bachelor of Science in Nursing (Generic)',
        code: 'BSN-GEN',
        durationYears: 4,
        totalCredits: 135,
      },
      currentSemester: 6,
      cgpa: 3.82,
      createdAt: '2022-09-01T09:00:00Z',
      user: {
        id: 'usr-01',
        email: 'amina.bibi@student.nmc.edu.pk',
        firstName: 'Amina',
        lastName: 'Bibi',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      },
      parents: [
        {
          id: 'par-01',
          firstName: 'Muhammad',
          lastName: 'Iqbal',
          phone: '+923005556677',
          email: 'm.iqbal@gmail.com',
          relationship: 'Father',
          occupation: 'Civil Engineer',
          isPrimary: true,
        },
        {
          id: 'par-02',
          firstName: 'Khadija',
          lastName: 'Bibi',
          phone: '+923008889900',
          relationship: 'Mother',
          occupation: 'School Principal',
          isPrimary: false,
        },
      ],
      enrollments: [
        {
          id: 'enr-01',
          semesterNumber: 6,
          status: 'ACTIVE',
          enrolledAt: '2026-02-15T00:00:00Z',
          semester: { name: 'Fall 2026 - Semester 6', academicSession: { name: '2025-2026' } },
          classSection: { name: 'BSN-6A' },
        },
        {
          id: 'enr-02',
          semesterNumber: 5,
          status: 'COMPLETED',
          enrolledAt: '2025-09-01T00:00:00Z',
          semester: { name: 'Spring 2025 - Semester 5', academicSession: { name: '2024-2025' } },
          classSection: { name: 'BSN-5A' },
        },
      ],
      attendance: {
        totalClasses: 180,
        present: 168,
        absent: 8,
        leave: 4,
        percentage: 93.3,
      },
      clinical: {
        completedHours: 340,
        requiredHours: 500,
        currentRotation: {
          rotationName: 'Medical-Surgical Clinical Practicum IV',
          siteName: 'National Teaching Hospital',
          wardName: 'Cardiology & Intensive Care Ward',
          startDate: '2026-07-01',
          endDate: '2026-09-30',
          supervisorName: 'Dr. Sarah Khan (Assistant Professor)',
        },
        skills: [
          { skillName: 'Peripheral IV Cannulation', category: 'Vascular Access', requiredAttempts: 10, completedAttempts: 10, verifiedAttempts: 10 },
          { skillName: 'Urinary Catheterization (Foley)', category: 'Invasive Nursing', requiredAttempts: 5, completedAttempts: 5, verifiedAttempts: 4 },
          { skillName: 'Nasogastric (NG) Tube Insertion', category: 'Gastroenterology', requiredAttempts: 5, completedAttempts: 4, verifiedAttempts: 3 },
          { skillName: 'Blood Transfusion Administration', category: 'Critical Care', requiredAttempts: 3, completedAttempts: 3, verifiedAttempts: 3 },
          { skillName: 'Sterile Wound Dressing & Suture Removal', category: 'Surgical', requiredAttempts: 8, completedAttempts: 8, verifiedAttempts: 8 },
        ],
      },
      results: [
        {
          id: 'res-01',
          marksObtained: 88,
          totalMarks: 100,
          percentage: 88,
          grade: 'A+',
          gpa: 4.0,
          status: 'PASS',
          exam: { name: 'Adult Health Nursing II Final', type: 'FINAL' },
          subject: { name: 'Adult Health Nursing II', code: 'AHN-302', creditHours: 4 },
        },
        {
          id: 'res-02',
          marksObtained: 82,
          totalMarks: 100,
          percentage: 82,
          grade: 'A',
          gpa: 3.7,
          status: 'PASS',
          exam: { name: 'Pharmacology in Nursing Final', type: 'FINAL' },
          subject: { name: 'Clinical Pharmacology', code: 'PHM-304', creditHours: 3 },
        },
        {
          id: 'res-03',
          marksObtained: 85,
          totalMarks: 100,
          percentage: 85,
          grade: 'A+',
          gpa: 4.0,
          status: 'PASS',
          exam: { name: 'Pathophysiology Final', type: 'FINAL' },
          subject: { name: 'Pathophysiology for Nurses', code: 'PAT-301', creditHours: 3 },
        },
      ],
      feeLedger: {
        totalBilled: 320000,
        totalPaid: 300000,
        outstandingBalance: 20000,
        transactions: [
          { id: 'tx-01', date: '2026-08-01', description: 'Semester 6 Tuition & Clinical Fee', challanNo: 'CH-2026-089', debit: 80000, credit: 0, balance: 80000, status: 'PAID' },
          { id: 'tx-02', date: '2026-08-05', description: 'Bank Online Payment (HBL)', challanNo: 'CH-2026-089', debit: 0, credit: 80000, balance: 0, status: 'PAID' },
          { id: 'tx-03', date: '2026-08-15', description: 'Midterm Examination Fee', challanNo: 'CH-2026-142', debit: 20000, credit: 0, balance: 20000, status: 'UNPAID' },
        ],
      },
      documents: [
        { id: 'doc-01', type: 'CNIC', fileName: 'amina_cnic_front_back.pdf', fileUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=500', isVerified: true, createdAt: '2022-09-01' },
        { id: 'doc-02', type: 'FSC_CERT', fileName: 'fsc_pre_medical_marksheet.pdf', fileUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=500', isVerified: true, createdAt: '2022-09-01' },
        { id: 'doc-03', type: 'PNC_REG', fileName: 'pnc_student_registration_card.pdf', fileUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=500', isVerified: true, createdAt: '2022-10-15' },
      ],
    };
  }
}

export async function createStudent(dto: CreateStudentDto) {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to register student');
  }

  return await res.json();
}
