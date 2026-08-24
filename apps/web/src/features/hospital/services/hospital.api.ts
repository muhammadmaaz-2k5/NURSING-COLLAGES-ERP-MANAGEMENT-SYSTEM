import {
  HospitalProfile,
  HospitalWard,
  Doctor,
  Patient,
  Appointment,
  Consultation,
  PatientAdmission,
  Prescription,
  LabTest,
  CreatePatientDto,
  CreateAppointmentDto,
  CreateConsultationDto,
  CreateAdmissionDto,
  TransferBedDto,
  DischargePatientDto,
  CreatePrescriptionDto,
  OrderLabTestDto,
  PatientStatus,
  AppointmentStatus,
} from '../types/hospital.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchHospitalProfile(): Promise<HospitalProfile> {
  try {
    const res = await fetch(`${API_BASE}/hospital/profile`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch hospital profile');
    return await res.json();
  } catch {
    return {
      name: 'Teaching Hospital & Clinical Medical Complex',
      totalBeds: 120,
      occupiedBeds: 86,
      availableBeds: 34,
      occupancyRate: 71.6,
      totalPatients: 2450,
      opdTodayCount: 142,
      activeAdmissionsCount: 86,
      dischargesTodayCount: 14,
    };
  }
}

export async function fetchHospitalWards(): Promise<HospitalWard[]> {
  try {
    const res = await fetch(`${API_BASE}/hospital/wards`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch wards');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'ward-01',
        name: 'General Medical Ward A',
        departmentName: 'Internal Medicine',
        floor: '1st Floor',
        capacity: 8,
        occupiedBedsCount: 5,
        availableBedsCount: 3,
        beds: [
          { id: 'b-01', bedNumber: 'B-01', type: 'GENERAL', status: 'OCCUPIED', wardId: 'ward-01', currentAdmission: { id: 'adm-01', patientId: 'pat-01', patientName: 'Ahmed Raza', patientNo: 'MRN-2026-0045', admittedAt: '2026-08-20', diagnosis: 'Acute Bronchitis' } },
          { id: 'b-02', bedNumber: 'B-02', type: 'GENERAL', status: 'AVAILABLE', wardId: 'ward-01' },
          { id: 'b-03', bedNumber: 'B-03', type: 'GENERAL', status: 'OCCUPIED', wardId: 'ward-01', currentAdmission: { id: 'adm-02', patientId: 'pat-02', patientName: 'Fatima Noor', patientNo: 'MRN-2026-0089', admittedAt: '2026-08-22', diagnosis: 'Pneumonia & Asthma' } },
          { id: 'b-04', bedNumber: 'B-04', type: 'GENERAL', status: 'AVAILABLE', wardId: 'ward-01' },
          { id: 'b-05', bedNumber: 'B-05', type: 'GENERAL', status: 'OCCUPIED', wardId: 'ward-01', currentAdmission: { id: 'adm-03', patientId: 'pat-03', patientName: 'Usman Ali', patientNo: 'MRN-2026-0102', admittedAt: '2026-08-23', diagnosis: 'Gastroenteritis' } },
          { id: 'b-06', bedNumber: 'B-06', type: 'GENERAL', status: 'AVAILABLE', wardId: 'ward-01' },
          { id: 'b-07', bedNumber: 'B-07', type: 'GENERAL', status: 'OCCUPIED', wardId: 'ward-01' },
          { id: 'b-08', bedNumber: 'B-08', type: 'GENERAL', status: 'OCCUPIED', wardId: 'ward-01' },
        ],
      },
      {
        id: 'ward-02',
        name: 'Intensive Care Unit (ICU)',
        departmentName: 'Critical Care',
        floor: '2nd Floor',
        capacity: 6,
        occupiedBedsCount: 4,
        availableBedsCount: 2,
        beds: [
          { id: 'b-11', bedNumber: 'ICU-01', type: 'ICU', status: 'OCCUPIED', wardId: 'ward-02', currentAdmission: { id: 'adm-04', patientId: 'pat-04', patientName: 'Zainab Bibi', patientNo: 'MRN-2026-0012', admittedAt: '2026-08-21', diagnosis: 'Post-op Cardiac Monitoring' } },
          { id: 'b-12', bedNumber: 'ICU-02', type: 'ICU', status: 'OCCUPIED', wardId: 'ward-02' },
          { id: 'b-13', bedNumber: 'ICU-03', type: 'ICU', status: 'AVAILABLE', wardId: 'ward-02' },
          { id: 'b-14', bedNumber: 'ICU-04', type: 'ICU', status: 'OCCUPIED', wardId: 'ward-02' },
          { id: 'b-15', bedNumber: 'ICU-05', type: 'ICU', status: 'OCCUPIED', wardId: 'ward-02' },
          { id: 'b-16', bedNumber: 'ICU-06', type: 'ICU', status: 'AVAILABLE', wardId: 'ward-02' },
        ],
      },
    ];
  }
}

export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const res = await fetch(`${API_BASE}/hospital/doctors`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return await res.json();
  } catch {
    return [
      { id: 'doc-01', name: 'Dr. Sarah Tariq', employeeId: 'DOC-01', specialization: 'Cardiologist', qualification: 'MBBS, FCPS', phone: '+923001234567', availability: 'Mon-Fri: 09:00-14:00', isActive: true, department: { id: 'd-1', name: 'Cardiology', type: 'OPD' } },
      { id: 'doc-02', name: 'Dr. Tariq Mahmood', employeeId: 'DOC-02', specialization: 'General Physician', qualification: 'MBBS, MRCP', phone: '+923007654321', availability: 'Mon-Sat: 10:00-16:00', isActive: true, department: { id: 'd-2', name: 'Internal Medicine', type: 'OPD' } },
      { id: 'doc-03', name: 'Dr. Bilal Siddiqui', employeeId: 'DOC-03', specialization: 'General Surgeon', qualification: 'MBBS, FCPS Surgery', phone: '+923009988776', availability: 'Tue, Thu, Sat: 09:00-13:00', isActive: true, department: { id: 'd-3', name: 'General Surgery', type: 'SURGERY' } },
    ];
  }
}

export async function fetchPatients(params?: {
  search?: string;
  status?: PatientStatus;
  page?: number;
  limit?: number;
}): Promise<{ data: Patient[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/hospital/patients?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch patients');
    const json = await res.json();
    if (Array.isArray(json)) return { data: json, total: json.length };
    return { data: json.data || [], total: json.total || json.data?.length || 0 };
  } catch {
    return {
      data: [
        {
          id: 'pat-01',
          patientNo: 'MRN-2026-0045',
          firstName: 'Ahmed',
          lastName: 'Raza',
          dateOfBirth: '1985-04-12',
          gender: 'MALE',
          phone: '+92 300 1122334',
          city: 'Islamabad',
          bloodGroup: 'B+',
          emergencyContact: 'Muhammad Raza (Brother)',
          allergies: 'Penicillin, Sulfa drugs',
          medicalHistory: 'Type-2 Diabetes, Hypertension',
          status: 'ADMITTED',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          createdAt: '2026-08-20',
        },
        {
          id: 'pat-02',
          patientNo: 'MRN-2026-0089',
          firstName: 'Fatima',
          lastName: 'Noor',
          dateOfBirth: '1992-09-18',
          gender: 'FEMALE',
          phone: '+92 333 4455667',
          city: 'Rawalpindi',
          bloodGroup: 'O+',
          emergencyContact: 'Tariq Noor (Father)',
          allergies: 'None known',
          medicalHistory: 'Asthma',
          status: 'ADMITTED',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          createdAt: '2026-08-22',
        },
        {
          id: 'pat-03',
          patientNo: 'MRN-2026-0102',
          firstName: 'Usman',
          lastName: 'Ali',
          dateOfBirth: '1978-11-04',
          gender: 'MALE',
          phone: '+92 321 8899001',
          city: 'Islamabad',
          bloodGroup: 'A+',
          emergencyContact: 'Rashid Ali (Son)',
          allergies: 'Aspirin',
          status: 'ACTIVE',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          createdAt: '2026-08-23',
        },
      ],
      total: 3,
    };
  }
}

export async function fetchPatientById(id: string): Promise<Patient> {
  try {
    const res = await fetch(`${API_BASE}/hospital/patients/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Patient not found');
    return await res.json();
  } catch {
    return {
      id: id || 'pat-01',
      patientNo: 'MRN-2026-0045',
      firstName: 'Ahmed',
      lastName: 'Raza',
      dateOfBirth: '1985-04-12',
      gender: 'MALE',
      phone: '+92 300 1122334',
      address: 'House 14, St 9, Sector F-8/2',
      city: 'Islamabad',
      bloodGroup: 'B+',
      emergencyContact: 'Muhammad Raza (Brother)',
      emergencyPhone: '+92 333 1122334',
      allergies: 'Penicillin, Sulfa drugs',
      medicalHistory: 'Type-2 Diabetes, Hypertension (Controlled on ACE inhibitors)',
      status: 'ADMITTED',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: '2026-08-20',
      admissions: [
        {
          id: 'adm-01',
          patientId: id || 'pat-01',
          patientName: 'Ahmed Raza',
          patientNo: 'MRN-2026-0045',
          bedId: 'b-01',
          bedNumber: 'B-01',
          wardName: 'General Medical Ward A',
          floor: '1st Floor',
          diagnosis: 'Acute Bronchitis & Exacerbation',
          notes: 'Admitted via Emergency. IV antibiotic course commenced.',
          admittedAt: '2026-08-20',
          status: 'ACTIVE',
        },
      ],
    };
  }
}

export async function fetchAppointments(params?: {
  doctorId?: string;
  status?: AppointmentStatus;
  date?: string;
}): Promise<Appointment[]> {
  try {
    const query = new URLSearchParams();
    if (params?.doctorId) query.append('doctorId', params.doctorId);
    if (params?.status) query.append('status', params.status);
    if (params?.date) query.append('date', params.date);

    const res = await fetch(`${API_BASE}/hospital/appointments?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch appointments');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      { id: 'app-01', tokenNumber: 1, patientId: 'pat-01', patientName: 'Ahmed Raza', patientNo: 'MRN-2026-0045', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', doctorId: 'doc-01', doctorName: 'Dr. Sarah Tariq', departmentName: 'Cardiology OPD', appointmentDate: '2026-08-24 10:00 AM', reason: 'Chest heaviness on stairs', status: 'IN_CONSULTATION' },
      { id: 'app-02', tokenNumber: 2, patientId: 'pat-02', patientName: 'Fatima Noor', patientNo: 'MRN-2026-0089', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', doctorId: 'doc-02', doctorName: 'Dr. Tariq Mahmood', departmentName: 'Internal Medicine', appointmentDate: '2026-08-24 10:30 AM', reason: 'High fever and productive cough', status: 'WAITING' },
      { id: 'app-03', tokenNumber: 3, patientId: 'pat-03', patientName: 'Usman Ali', patientNo: 'MRN-2026-0102', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', doctorId: 'doc-02', doctorName: 'Dr. Tariq Mahmood', departmentName: 'Internal Medicine', appointmentDate: '2026-08-24 11:00 AM', reason: 'Routine diabetic follow-up', status: 'SCHEDULED' },
    ];
  }
}

export async function createPatient(dto: CreatePatientDto) {
  const res = await fetch(`${API_BASE}/hospital/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to register patient');
  }

  return await res.json();
}

export async function createAppointment(dto: CreateAppointmentDto) {
  const res = await fetch(`${API_BASE}/hospital/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to schedule appointment');
  }

  return await res.json();
}

export async function createConsultation(dto: CreateConsultationDto) {
  const res = await fetch(`${API_BASE}/hospital/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save clinical consultation');
  }

  return await res.json();
}

export async function admitPatient(dto: CreateAdmissionDto) {
  const res = await fetch(`${API_BASE}/hospital/admissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Bed is already occupied or unavailable');
  }

  return await res.json();
}

export async function transferBed(admissionId: string, targetBedId: string) {
  const res = await fetch(`${API_BASE}/hospital/admissions/${admissionId}/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetBedId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Target bed is occupied or invalid');
  }

  return await res.json();
}

export async function dischargePatient(admissionId: string, dto: DischargePatientDto) {
  const res = await fetch(`${API_BASE}/hospital/admissions/${admissionId}/discharge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to discharge patient');
  }

  return await res.json();
}
