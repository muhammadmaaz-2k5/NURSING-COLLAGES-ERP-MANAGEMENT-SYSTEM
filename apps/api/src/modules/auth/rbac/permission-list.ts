import { ModuleType, PermissionAction } from '@prisma/client';

export interface SystemPermissionDef {
  code: string;
  module: ModuleType;
  action: PermissionAction;
  resource: string;
  description: string;
}

export const SYSTEM_PERMISSIONS: SystemPermissionDef[] = [
  // Academic & Curriculum
  { code: 'academic.department.read', module: ModuleType.ACADEMIC, action: PermissionAction.READ, resource: 'department', description: 'View academic departments' },
  { code: 'academic.department.create', module: ModuleType.ACADEMIC, action: PermissionAction.CREATE, resource: 'department', description: 'Create academic departments' },
  { code: 'academic.program.read', module: ModuleType.ACADEMIC, action: PermissionAction.READ, resource: 'program', description: 'View degree programs' },
  { code: 'academic.program.create', module: ModuleType.ACADEMIC, action: PermissionAction.CREATE, resource: 'program', description: 'Create degree programs' },
  { code: 'academic.session.manage', module: ModuleType.ACADEMIC, action: PermissionAction.MANAGE, resource: 'session', description: 'Manage academic sessions and semesters' },

  // Admissions
  { code: 'admissions.application.read', module: ModuleType.ADMISSIONS, action: PermissionAction.READ, resource: 'application', description: 'View admission applications' },
  { code: 'admissions.application.create', module: ModuleType.ADMISSIONS, action: PermissionAction.CREATE, resource: 'application', description: 'Submit admission applications' },
  { code: 'admissions.application.manage', module: ModuleType.ADMISSIONS, action: PermissionAction.MANAGE, resource: 'application', description: 'Approve, reject, or enroll applicants' },

  // Students
  { code: 'student.read', module: ModuleType.STUDENTS, action: PermissionAction.READ, resource: 'student', description: 'View student profiles and records' },
  { code: 'student.create', module: ModuleType.STUDENTS, action: PermissionAction.CREATE, resource: 'student', description: 'Register new students' },
  { code: 'student.update', module: ModuleType.STUDENTS, action: PermissionAction.UPDATE, resource: 'student', description: 'Update student profiles' },
  { code: 'student.delete', module: ModuleType.STUDENTS, action: PermissionAction.DELETE, resource: 'student', description: 'Archive or remove student records' },

  // Faculty
  { code: 'faculty.read', module: ModuleType.FACULTY, action: PermissionAction.READ, resource: 'faculty', description: 'View faculty instructors and workload' },
  { code: 'faculty.create', module: ModuleType.FACULTY, action: PermissionAction.CREATE, resource: 'faculty', description: 'Add new faculty members' },
  { code: 'faculty.update', module: ModuleType.FACULTY, action: PermissionAction.UPDATE, resource: 'faculty', description: 'Update faculty designations and assignments' },

  // Attendance
  { code: 'attendance.read', module: ModuleType.ATTENDANCE, action: PermissionAction.READ, resource: 'attendance', description: 'View student and faculty attendance records' },
  { code: 'attendance.create', module: ModuleType.ATTENDANCE, action: PermissionAction.CREATE, resource: 'attendance', description: 'Mark student and class attendance' },

  // Examinations & Results
  { code: 'exam.read', module: ModuleType.EXAMINATIONS, action: PermissionAction.READ, resource: 'exam', description: 'View exam schedules' },
  { code: 'exam.create', module: ModuleType.EXAMINATIONS, action: PermissionAction.CREATE, resource: 'exam', description: 'Schedule examinations and tests' },
  { code: 'result.read', module: ModuleType.RESULTS, action: PermissionAction.READ, resource: 'result', description: 'View student grades and transcripts' },
  { code: 'result.publish', module: ModuleType.RESULTS, action: PermissionAction.MANAGE, resource: 'result', description: 'Enter marks and publish exam results' },

  // Fees & Finance
  { code: 'fee.structure.manage', module: ModuleType.FEES, action: PermissionAction.MANAGE, resource: 'structure', description: 'Create and update fee structures' },
  { code: 'payment.read', module: ModuleType.FINANCE, action: PermissionAction.READ, resource: 'payment', description: 'View student fee invoices and payment ledger' },
  { code: 'payment.create', module: ModuleType.FINANCE, action: PermissionAction.CREATE, resource: 'payment', description: 'Record student fee payments' },

  // Clinical Training & Nursing Skills (Specialized Healthcare ERP)
  { code: 'clinical.site.read', module: ModuleType.CLINICAL_TRAINING, action: PermissionAction.READ, resource: 'site', description: 'View hospital clinical training sites' },
  { code: 'clinical.training.read', module: ModuleType.CLINICAL_TRAINING, action: PermissionAction.READ, resource: 'training', description: 'View student hospital ward rotations' },
  { code: 'clinical.training.manage', module: ModuleType.CLINICAL_TRAINING, action: PermissionAction.MANAGE, resource: 'training', description: 'Allocate and manage student clinical ward postings' },
  { code: 'clinical.skill.verify', module: ModuleType.CLINICAL_TRAINING, action: PermissionAction.MANAGE, resource: 'skill', description: 'Supervisors grade and verify nursing competency logbook skills' },

  // Hospital & OPD/IPD
  { code: 'hospital.patient.read', module: ModuleType.HOSPITAL, action: PermissionAction.READ, resource: 'patient', description: 'View hospital patients' },
  { code: 'hospital.patient.create', module: ModuleType.HOSPITAL, action: PermissionAction.CREATE, resource: 'patient', description: 'Register new hospital patients' },
  { code: 'hospital.ward.manage', module: ModuleType.HOSPITAL, action: PermissionAction.MANAGE, resource: 'ward', description: 'Manage hospital beds and admissions' },
  { code: 'hospital.prescription.create', module: ModuleType.HOSPITAL, action: PermissionAction.CREATE, resource: 'prescription', description: 'Issue electronic prescriptions' },

  // Pharmacy
  { code: 'pharmacy.read', module: ModuleType.PHARMACY, action: PermissionAction.READ, resource: 'medicine', description: 'View pharmacy medicine inventory' },
  { code: 'pharmacy.manage', module: ModuleType.PHARMACY, action: PermissionAction.MANAGE, resource: 'medicine', description: 'Add and restock pharmacy medicines' },

  // Campus Facilities
  { code: 'facilities.hostel.manage', module: ModuleType.HOSTEL, action: PermissionAction.MANAGE, resource: 'hostel', description: 'Allocate hostel rooms and beds' },
  { code: 'facilities.library.issue', module: ModuleType.LIBRARY, action: PermissionAction.MANAGE, resource: 'book', description: 'Catalog and issue library books' },
  { code: 'facilities.transport.manage', module: ModuleType.TRANSPORT, action: PermissionAction.MANAGE, resource: 'transport', description: 'Manage transport routes and bus passes' },

  // Human Resources & Payroll
  { code: 'hr.employee.read', module: ModuleType.HR, action: PermissionAction.READ, resource: 'employee', description: 'View staff employees' },
  { code: 'hr.leave.manage', module: ModuleType.HR, action: PermissionAction.MANAGE, resource: 'leave', description: 'Approve or reject staff leave requests' },
  { code: 'hr.payroll.process', module: ModuleType.PAYROLL, action: PermissionAction.MANAGE, resource: 'payroll', description: 'Process monthly payroll' },

  // System Administration
  { code: 'system.settings.manage', module: ModuleType.WEBSITE, action: PermissionAction.MANAGE, resource: 'settings', description: 'Configure college settings' },
  { code: 'system.module.toggle', module: ModuleType.WEBSITE, action: PermissionAction.MANAGE, resource: 'module', description: 'Enable or disable SaaS modules' },
  { code: 'system.user.manage', module: ModuleType.WEBSITE, action: PermissionAction.MANAGE, resource: 'user', description: 'Manage users, roles, and permissions' },
];
