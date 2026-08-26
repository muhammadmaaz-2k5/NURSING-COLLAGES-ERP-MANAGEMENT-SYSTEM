import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/modules/auth/guards/permissions.guard';
import { ModuleEnabledGuard } from '../src/common/guards/module-enabled.guard';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

export const mockPrismaService = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $transaction: jest.fn().mockImplementation((cb) => (typeof cb === 'function' ? cb(mockPrismaService) : Promise.all(cb))),

  college: {
    findFirst: jest.fn().mockResolvedValue({
      id: 'col-01',
      name: 'Islamabad College of Nursing & Allied Health Sciences',
      code: 'ICN-01',
      city: 'Islamabad',
      email: 'info@nursingcollege.edu.pk',
      phone: '+92-51-1122334',
      address: 'Sector H-8, Islamabad',
    }),
  },

  collegeModule: {
    findMany: jest.fn().mockResolvedValue([
      { module: 'ACADEMIC', isEnabled: true },
      { module: 'STUDENTS', isEnabled: true },
      { module: 'FACULTY', isEnabled: true },
      { module: 'ATTENDANCE', isEnabled: true },
      { module: 'EXAMINATIONS', isEnabled: true },
      { module: 'FEES', isEnabled: true },
      { module: 'CLINICAL_TRAINING', isEnabled: true },
      { module: 'HOSPITAL', isEnabled: true },
      { module: 'PHARMACY', isEnabled: true },
      { module: 'HOSTEL', isEnabled: true },
      { module: 'LIBRARY', isEnabled: true },
      { module: 'TRANSPORT', isEnabled: true },
      { module: 'HR', isEnabled: true },
      { module: 'WEBSITE', isEnabled: true },
    ]),
    findUnique: jest.fn().mockResolvedValue({ isEnabled: true }),
  },

  program: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'prog-01', name: 'Bachelor of Science in Nursing (Generic)', code: 'BSN-GEN', durationYears: 4, totalCredits: 136, isActive: true, subjects: [] },
      { id: 'prog-02', name: 'Post-RN BSN Degree Program', code: 'POST-RN', durationYears: 2, totalCredits: 68, isActive: true, subjects: [] },
    ]),
    findUnique: jest.fn().mockResolvedValue({
      id: 'prog-01',
      name: 'Bachelor of Science in Nursing (Generic)',
      code: 'BSN-GEN',
      isActive: true,
    }),
    count: jest.fn().mockResolvedValue(4),
  },

  notification: {
    count: jest.fn().mockResolvedValue(2),
    findMany: jest.fn().mockResolvedValue([
      {
        id: 'notif-1',
        userId: 'usr-admin-01',
        title: 'New Admission Application',
        message: 'Amina Bibi submitted application for Generic BSN.',
        type: 'ADMISSION',
        status: 'UNREAD',
        createdAt: new Date(),
      },
    ]),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
  },

  student: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'stud-01', studentId: 'NUR-2022-0041', user: { firstName: 'Amina', lastName: 'Bibi' }, program: { name: 'Generic BSN' } },
    ]),
    findFirst: jest.fn().mockResolvedValue({
      id: 'stud-01',
      studentId: 'NUR-2022-0041',
      status: 'ACTIVE',
      user: { firstName: 'Amina', lastName: 'Bibi' },
      program: { name: 'Generic BSN' },
      results: [{ status: 'PASS', exam: { name: 'Anatomy Midterm' }, subject: { name: 'Human Anatomy' } }],
    }),
    findUnique: jest.fn().mockResolvedValue({
      id: 'stud-01',
      studentId: 'NUR-2022-0041',
      user: { firstName: 'Amina', lastName: 'Bibi' },
      program: { name: 'Generic BSN' },
    }),
    count: jest.fn().mockResolvedValue(450),
  },

  faculty: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'fac-01', employeeId: 'FAC-101', designation: 'Assistant Professor', user: { firstName: 'Dr. Sarah', lastName: 'Khan' }, department: { name: 'Nursing' } },
    ]),
    count: jest.fn().mockResolvedValue(38),
  },

  hospital: {
    findFirst: jest.fn().mockResolvedValue({
      id: 'hosp-01',
      name: 'Main Teaching Hospital',
      code: 'HOSP-01',
      city: 'Islamabad',
    }),
    create: jest.fn().mockResolvedValue({
      id: 'hosp-01',
      name: 'Main Teaching Hospital',
      code: 'HOSP-01',
      city: 'Islamabad',
    }),
  },

  pharmacy: {
    findFirst: jest.fn().mockResolvedValue({
      id: 'pharm-01',
      name: 'Main Dispensary & Pharmacy',
    }),
    create: jest.fn().mockResolvedValue({
      id: 'pharm-01',
      name: 'Main Dispensary & Pharmacy',
    }),
  },

  exam: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'exam-01', name: 'Midterm Examination 2026', totalMarks: 100, passingMarks: 50 },
    ]),
    count: jest.fn().mockResolvedValue(1),
  },

  feeStructure: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'fee-01', name: 'Semester Tuition Fee', amount: '65000.00', feeType: 'TUITION' },
    ]),
  },

  hospitalDepartment: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'dept-01', name: 'Accident & Emergency', type: 'EMERGENCY', wards: [], doctors: [] },
      { id: 'dept-02', name: 'Inpatient Medicine', type: 'MEDICINE', wards: [], doctors: [] },
    ]),
  },


  hospitalBed: {
    count: jest.fn().mockResolvedValue(250),
    findMany: jest.fn().mockResolvedValue([]),
  },

  patientAdmission: {
    count: jest.fn().mockResolvedValue(42),
    findMany: jest.fn().mockResolvedValue([]),
  },

  doctor: {
    count: jest.fn().mockResolvedValue(18),
    findMany: jest.fn().mockResolvedValue([]),
  },

  appointment: {
    count: jest.fn().mockResolvedValue(120),
    findMany: jest.fn().mockResolvedValue([]),
  },

  medicine: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'med-01', name: 'Ceftriaxone 1g IV', category: 'Antibiotic', quantity: 240, reorderLevel: 50, price: '350.00', batches: [] },
      { id: 'med-02', name: 'Paracetamol 500mg', category: 'Analgesic', quantity: 15, reorderLevel: 50, price: '20.00', batches: [] },
    ]),
    count: jest.fn().mockResolvedValue(2),
  },

  medicineBatch: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'batch-01', batchNumber: 'LOT-2026-01', quantity: 240, expiryDate: new Date('2027-12-31') },
    ]),
    count: jest.fn().mockResolvedValue(10),
  },

  medicineStockMovement: {
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
  },

  dispensingRecord: {
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
  },

  hostel: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'hostel-01', name: 'Florence Nightingale Hall', capacity: 120, rooms: [] },
    ]),
  },

  library: {
    findFirst: jest.fn().mockResolvedValue({
      id: 'lib-01',
      name: 'Central Medical & Nursing Library',
    }),
    create: jest.fn().mockResolvedValue({
      id: 'lib-01',
      name: 'Central Medical & Nursing Library',
    }),
  },

  libraryBook: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'book-01', title: 'Brunner & Suddarth Textbook of Medical-Surgical Nursing', author: 'Janice Hinkle', isbn: '978-1496347992', copies: [] },
    ]),
    count: jest.fn().mockResolvedValue(1),
  },


  transportRoute: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'route-01', name: 'Rawalpindi - Islamabad Express Route', vehicle: { name: 'College Bus 01', capacity: 45 } },
    ]),
  },

  employee: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'emp-01', employeeCode: 'EMP-101', designation: 'Senior Instructor', basicSalary: '95000.00' },
    ]),
    count: jest.fn().mockResolvedValue(45),
  },

  notice: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'not-01', title: 'Fall 2026 Admissions Open', isPublished: true, publishedAt: new Date() },
    ]),
  },

  news: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'news-01', title: 'Annual Nursing Convocation 2026', status: 'PUBLISHED', publishedAt: new Date() },
    ]),
    count: jest.fn().mockResolvedValue(1),
  },

  event: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'ev-01', title: 'Simulation Workshop', status: 'PUBLISHED', startDate: new Date() },
    ]),
  },

  page: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'p-01', title: 'About Us', slug: 'about-us', status: 'PUBLISHED' },
    ]),
  },

  certificate: {
    findFirst: jest.fn().mockResolvedValue({
      id: 'cert-01',
      certificateNo: 'CERT-2026-BSN-089',
      type: 'COURSE_COMPLETION',
      title: 'Bachelor of Science in Nursing',
      issueDate: new Date('2026-08-20'),
      studentId: 'stud-01',
      student: {
        user: { firstName: 'Amina', lastName: 'Bibi' },
        program: { name: 'Bachelor of Science in Nursing', code: 'BSN-GEN' },
      },
    }),
  },

  admissionApplication: {
    create: jest.fn().mockResolvedValue({
      id: 'app-01',
      applicationNo: 'APP-2026-123456',
      firstName: 'Amina',
      lastName: 'Bibi',
      appliedAt: new Date(),
      program: { name: 'Generic BSN' },
    }),
  },
};

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context: any) => {
        const req = context.switchToHttp().getRequest();
        req.user = {
          id: 'test-admin-id',
          email: 'admin@college.edu.pk',
          roles: ['SUPER_ADMIN', 'ADMIN'],
          permissions: ['*'],
        };
        return true;
      },
    })
    .overrideGuard(PermissionsGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(ModuleEnabledGuard)
    .useValue({ canActivate: () => true })
    .compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}
