export type HospitalDepartmentType = 'OPD' | 'IPD' | 'EMERGENCY' | 'ICU' | 'SURGERY' | 'PEDIATRICS' | 'GYNECOLOGY' | 'CARDIOLOGY' | 'ORTHOPEDICS';
export type HospitalBedType = 'GENERAL' | 'ICU' | 'CCU' | 'PRIVATE' | 'SEMI_PRIVATE' | 'EMERGENCY';
export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
export type AppointmentStatus = 'SCHEDULED' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED';
export type PatientStatus = 'ACTIVE' | 'ADMITTED' | 'DISCHARGED' | 'DECEASED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type LabTestStatus = 'ORDERED' | 'SAMPLE_COLLECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface HospitalBed {
  id: string;
  bedNumber: string;
  type: HospitalBedType;
  status: BedStatus;
  wardId: string;
  wardName?: string;
  currentAdmission?: {
    id: string;
    patientId: string;
    patientName: string;
    patientNo: string;
    admittedAt: string;
    diagnosis?: string;
  };
}

export interface HospitalWard {
  id: string;
  name: string;
  departmentId?: string;
  departmentName?: string;
  floor?: string;
  capacity: number;
  occupiedBedsCount: number;
  availableBedsCount: number;
  beds: HospitalBed[];
}

export interface Doctor {
  id: string;
  name: string;
  employeeId?: string;
  specialization?: string;
  qualification?: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
  availability?: string;
  isActive: boolean;
  department?: {
    id: string;
    name: string;
    type: HospitalDepartmentType;
  };
}

export interface Patient {
  id: string;
  patientNo: string; // MRN
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  city?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string;
  medicalHistory?: string;
  status: PatientStatus;
  avatarUrl?: string;
  createdAt: string;
  admissions?: PatientAdmission[];
}

export interface Appointment {
  id: string;
  tokenNumber: number;
  patientId: string;
  patientName: string;
  patientNo: string;
  avatarUrl?: string;
  doctorId: string;
  doctorName: string;
  departmentName: string;
  appointmentDate: string;
  reason?: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  patientNo: string;
  doctorId: string;
  doctorName: string;
  symptoms?: string;
  diagnosis: string;
  clinicalNotes?: string;
  vitalSigns?: {
    bp?: string;
    pulse?: number;
    temp?: number;
    spo2?: number;
    weight?: number;
  };
  followUpDate?: string;
  createdAt: string;
}

export interface PatientAdmission {
  id: string;
  patientId: string;
  patientName: string;
  patientNo: string;
  avatarUrl?: string;
  bedId: string;
  bedNumber: string;
  wardName: string;
  floor?: string;
  diagnosis?: string;
  notes?: string;
  admittedAt: string;
  dischargedAt?: string;
  dischargeSummary?: string;
  status: 'ACTIVE' | 'DISCHARGED';
}

export interface PrescriptionItem {
  medicineName: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  prescriptionNo: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis?: string;
  notes?: string;
  createdAt: string;
  items: PrescriptionItem[];
}

export interface LabTest {
  id: string;
  testName: string;
  patientId: string;
  patientName: string;
  patientNo: string;
  status: LabTestStatus;
  orderedAt: string;
  completedAt?: string;
  results?: string;
}

export interface HospitalProfile {
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  totalPatients: number;
  opdTodayCount: number;
  activeAdmissionsCount: number;
  dischargesTodayCount: number;
}

export interface CreatePatientDto {
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  city?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  departmentId?: string;
  appointmentDate: string;
  reason?: string;
  notes?: string;
}

export interface CreateConsultationDto {
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  symptoms?: string;
  diagnosis: string;
  clinicalNotes?: string;
  vitalSigns?: {
    bp?: string;
    pulse?: number;
    temp?: number;
    spo2?: number;
  };
  followUpDate?: string;
}

export interface CreateAdmissionDto {
  patientId: string;
  bedId: string;
  diagnosis?: string;
  notes?: string;
}

export interface TransferBedDto {
  targetBedId: string;
}

export interface DischargePatientDto {
  dischargeSummary?: string;
}

export interface CreatePrescriptionDto {
  patientId: string;
  doctorId: string;
  diagnosis?: string;
  notes?: string;
  items: PrescriptionItem[];
}

export interface OrderLabTestDto {
  patientId: string;
  testName: string;
}
