import { FacultyMember, CreateFacultyDto, FacultyWorkload } from '../types/faculty.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchFaculty(params?: {
  search?: string;
  departmentId?: string;
  campusId?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: FacultyMember[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.departmentId) query.append('departmentId', params.departmentId);
    if (params?.campusId) query.append('campusId', params.campusId);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/faculty?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch faculty directory');
    const json = await res.json();
    if (Array.isArray(json)) return { data: json, total: json.length };
    return { data: json.data || [], total: json.total || json.data?.length || 0 };
  } catch {
    return {
      data: [
        {
          id: 'fac-01',
          employeeId: 'EMP-NUR-001',
          firstName: 'Dr. Sarah',
          lastName: 'Khan',
          email: 'sarah.khan@nmc.edu.pk',
          phone: '+92 300 8877665',
          designation: 'Assistant Professor of Nursing',
          qualification: 'MSN, BScN (PNC Registered RN, RM)',
          specialization: 'Adult Critical Care & Emergency Nursing',
          joiningDate: '2021-01-15',
          department: { id: 'dept-01', name: 'Department of Nursing & Clinical Care', code: 'NUR-DEPT' },
          campus: { id: 'camp-01', name: 'Main Healthcare Campus', code: 'CAMP-MAIN' },
          user: {
            id: 'usr-fac-01',
            email: 'sarah.khan@nmc.edu.pk',
            firstName: 'Dr. Sarah',
            lastName: 'Khan',
            status: 'ACTIVE',
            avatarUrl: 'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150',
          },
          workload: {
            facultyId: 'fac-01',
            facultyName: 'Dr. Sarah Khan',
            designation: 'Assistant Professor of Nursing',
            theoryHours: 8,
            practicalHours: 4,
            clinicalHours: 6,
            totalHours: 18,
            maxRecommendedHours: 18,
            isOverloaded: false,
            coursesCount: 3,
            sectionsCount: 3,
            totalStudents: 125,
          },
          courseAllocations: [
            { id: 'ca-01', subjectId: 'sub-02', subjectName: 'Fundamentals of Nursing II', subjectCode: 'FON-102', programName: 'Generic BSN', semesterName: 'Semester 2', sectionName: 'Section A', theoryCredits: 2, practicalCredits: 1, clinicalCredits: 2, totalCredits: 5, studentCount: 45 },
            { id: 'ca-02', subjectId: 'sub-08', subjectName: 'Adult Health Nursing II', subjectCode: 'AHN-302', programName: 'Generic BSN', semesterName: 'Semester 6', sectionName: 'Section A', theoryCredits: 2, practicalCredits: 1, clinicalCredits: 2, totalCredits: 5, studentCount: 42 },
          ],
          supervisions: [
            { id: 'sup-01', rotationName: 'Medical-Surgical Practicum IV', siteName: 'National Teaching Hospital', wardName: 'Cardiology & ICU', studentCount: 22, activeStudents: 22 },
          ],
        },
        {
          id: 'fac-02',
          employeeId: 'EMP-NUR-002',
          firstName: 'Dr. Tariq',
          lastName: 'Mahmood',
          email: 'tariq.mahmood@nmc.edu.pk',
          phone: '+92 301 5544332',
          designation: 'Associate Professor of Anatomy',
          qualification: 'MBBS, MPhil Anatomy',
          specialization: 'Human Morphological Sciences & Histology',
          joiningDate: '2019-08-01',
          department: { id: 'dept-01', name: 'Department of Nursing & Clinical Care', code: 'NUR-DEPT' },
          campus: { id: 'camp-01', name: 'Main Healthcare Campus', code: 'CAMP-MAIN' },
          user: {
            id: 'usr-fac-02',
            email: 'tariq.mahmood@nmc.edu.pk',
            firstName: 'Dr. Tariq',
            lastName: 'Mahmood',
            status: 'ACTIVE',
            avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
          },
          workload: {
            facultyId: 'fac-02',
            facultyName: 'Dr. Tariq Mahmood',
            designation: 'Associate Professor of Anatomy',
            theoryHours: 12,
            practicalHours: 8,
            clinicalHours: 0,
            totalHours: 20,
            maxRecommendedHours: 18,
            isOverloaded: true,
            coursesCount: 3,
            sectionsCount: 4,
            totalStudents: 160,
          },
          courseAllocations: [
            { id: 'ca-03', subjectId: 'sub-01', subjectName: 'Human Anatomy & Physiology I', subjectCode: 'ANAT-101', programName: 'Generic BSN', semesterName: 'Semester 1', sectionName: 'Section A', theoryCredits: 3, practicalCredits: 1, clinicalCredits: 0, totalCredits: 4, studentCount: 50 },
            { id: 'ca-04', subjectId: 'sub-05', subjectName: 'Human Anatomy & Physiology II', subjectCode: 'ANAT-102', programName: 'Generic BSN', semesterName: 'Semester 2', sectionName: 'Section A', theoryCredits: 3, practicalCredits: 1, clinicalCredits: 0, totalCredits: 4, studentCount: 55 },
          ],
          supervisions: [],
        },
        {
          id: 'fac-03',
          employeeId: 'EMP-NUR-003',
          firstName: 'Dr. Usman',
          lastName: 'Ali',
          email: 'usman.ali@nmc.edu.pk',
          phone: '+92 302 9988112',
          designation: 'Senior Lecturer in Pharmacology',
          qualification: 'PharmD, MPhil Pharmacology',
          specialization: 'Clinical Pharmacokinetics & Drug Safety',
          joiningDate: '2022-03-01',
          department: { id: 'dept-01', name: 'Department of Nursing & Clinical Care', code: 'NUR-DEPT' },
          campus: { id: 'camp-01', name: 'Main Healthcare Campus', code: 'CAMP-MAIN' },
          user: {
            id: 'usr-fac-03',
            email: 'usman.ali@nmc.edu.pk',
            firstName: 'Dr. Usman',
            lastName: 'Ali',
            status: 'ACTIVE',
            avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
          },
          workload: {
            facultyId: 'fac-03',
            facultyName: 'Dr. Usman Ali',
            designation: 'Senior Lecturer in Pharmacology',
            theoryHours: 9,
            practicalHours: 0,
            clinicalHours: 0,
            totalHours: 9,
            maxRecommendedHours: 18,
            isOverloaded: false,
            coursesCount: 2,
            sectionsCount: 2,
            totalStudents: 85,
          },
          courseAllocations: [
            { id: 'ca-05', subjectId: 'sub-09', subjectName: 'Clinical Pharmacology & Therapeutics', subjectCode: 'PHM-304', programName: 'Generic BSN', semesterName: 'Semester 6', sectionName: 'Section A', theoryCredits: 3, practicalCredits: 0, clinicalCredits: 0, totalCredits: 3, studentCount: 42 },
          ],
          supervisions: [],
        },
      ],
      total: 3,
    };
  }
}

export async function fetchFacultyById(id: string): Promise<FacultyMember> {
  try {
    const res = await fetch(`${API_BASE}/faculty/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Faculty member not found');
    return await res.json();
  } catch {
    const list = await fetchFaculty();
    return list.data.find((f) => f.id === id) || list.data[0];
  }
}

export async function createFaculty(dto: CreateFacultyDto) {
  const res = await fetch(`${API_BASE}/faculty`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create faculty member');
  }

  return await res.json();
}
