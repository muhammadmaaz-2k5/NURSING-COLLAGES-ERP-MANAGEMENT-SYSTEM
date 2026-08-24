import { PrismaClient, ModuleType, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PERN ERP Database Seed (Dedicated DB per College)...');

  // 1. Create College Profile
  const college = await prisma.college.upsert({
    where: { code: 'NMC-01' },
    update: {},
    create: {
      name: 'National Medical & Healthcare College',
      code: 'NMC-01',
      slug: 'national-medical-college',
      description: 'Premier Multi-Disciplinary Healthcare & Medical Institute',
      email: 'admissions@nmc.edu.pk',
      phone: '+92-51-111-222-333',
      website: 'https://nmc.edu.pk',
      address: 'Sector H-8/4, Healthcare Boulevard',
      city: 'Islamabad',
      province: 'Federal Capital',
      country: 'Pakistan',
      isActive: true,
      settings: {
        create: {
          timezone: 'Asia/Karachi',
          currency: 'PKR',
          gradingSystem: {
            grades: [
              { grade: 'A+', minPercentage: 85, gpa: 4.0 },
              { grade: 'A', minPercentage: 80, gpa: 3.7 },
              { grade: 'B+', minPercentage: 75, gpa: 3.3 },
              { grade: 'B', minPercentage: 70, gpa: 3.0 },
              { grade: 'C', minPercentage: 60, gpa: 2.5 },
              { grade: 'F', minPercentage: 0, gpa: 0.0 },
            ],
          },
        },
      },
    },
  });

  console.log(`✅ College profile created: ${college.name} (${college.id})`);

  // 2. Configure Enabled Modules for the College
  const moduleConfigs: { module: ModuleType; enabled: boolean }[] = [
    { module: ModuleType.ACADEMIC, enabled: true },
    { module: ModuleType.STUDENTS, enabled: true },
    { module: ModuleType.ADMISSIONS, enabled: true },
    { module: ModuleType.FACULTY, enabled: true },
    { module: ModuleType.ATTENDANCE, enabled: true },
    { module: ModuleType.EXAMINATIONS, enabled: true },
    { module: ModuleType.RESULTS, enabled: true },
    { module: ModuleType.FEES, enabled: true },
    { module: ModuleType.CLINICAL_TRAINING, enabled: true },
    { module: ModuleType.HOSPITAL, enabled: true },
    { module: ModuleType.PHARMACY, enabled: true },
    { module: ModuleType.LABORATORY, enabled: true },
    { module: ModuleType.HOSTEL, enabled: true },
    { module: ModuleType.LIBRARY, enabled: true },
    { module: ModuleType.HR, enabled: true },
    { module: ModuleType.PAYROLL, enabled: true },
    { module: ModuleType.INVENTORY, enabled: true },
    { module: ModuleType.PROCUREMENT, enabled: true },
    { module: ModuleType.COMMUNICATION, enabled: true },
    { module: ModuleType.EVENTS, enabled: true },
    { module: ModuleType.DOCUMENTS, enabled: true },
    { module: ModuleType.ALUMNI, enabled: true },
    { module: ModuleType.CERTIFICATES, enabled: true },
    { module: ModuleType.TRANSPORT, enabled: false },
  ];

  for (const m of moduleConfigs) {
    await prisma.collegeModule.upsert({
      where: {
        module: m.module,
      },
      update: { enabled: m.enabled },
      create: {
        collegeId: college.id,
        module: m.module,
        enabled: m.enabled,
      },
    });
  }
  console.log(`✅ Modules configured: ${moduleConfigs.length} modules initialized`);

  // 3. Create Standard System Roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Complete system access across all modules', isSystem: true },
    { name: 'COLLEGE_ADMIN', description: 'Administrative access for college operations', isSystem: true },
    { name: 'FACULTY', description: 'Academic instructor with grading and attendance access', isSystem: true },
    { name: 'STUDENT', description: 'Student portal with classes, results, and fee access', isSystem: true },
    { name: 'DOCTOR', description: 'Hospital clinical and prescription manager', isSystem: true },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: {
        name: r.name,
      },
      update: {},
      create: {
        name: r.name,
        description: r.description,
        isSystem: r.isSystem,
      },
    });
  }
  console.log('✅ System roles created');

  // 4. Create Main Campus & Departments
  const campus = await prisma.campus.upsert({
    where: {
      code: 'MAIN-CAMPUS',
    },
    update: {},
    create: {
      name: 'Main Healthcare City Campus',
      code: 'MAIN-CAMPUS',
      address: 'Healthcare Avenue, Sector H-8',
      city: 'Islamabad',
      phone: '+92-51-111-222-333',
    },
  });

  const departmentNursing = await prisma.department.upsert({
    where: {
      code: 'DEPT-NURSING',
    },
    update: {},
    create: {
      name: 'Department of Nursing & Clinical Care',
      code: 'DEPT-NURSING',
      description: 'BSN and Post-RN Clinical Nursing Programs',
    },
  });

  const departmentMedicine = await prisma.department.upsert({
    where: {
      code: 'DEPT-MEDICINE',
    },
    update: {},
    create: {
      name: 'Department of Allied Health Sciences',
      code: 'DEPT-MEDICINE',
      description: 'Medical Laboratory Technology & Radiography',
    },
  });

  // 5. Create Academic Programs
  const bsnProgram = await prisma.program.upsert({
    where: {
      code: 'BSN-4YR',
    },
    update: {},
    create: {
      departmentId: departmentNursing.id,
      name: 'Bachelor of Science in Nursing (Generic)',
      code: 'BSN-4YR',
      durationYears: 4,
      totalCredits: 135,
      description: 'Comprehensive 4-year degree recognized by PNC and HEC',
    },
  });

  console.log(`✅ Departments & Programs created: ${bsnProgram.name}`);

  // 6. Create Superadmin User
  const superAdminRole = await prisma.role.findFirst({
    where: { name: 'SUPER_ADMIN' },
  });

  if (superAdminRole) {
    const adminUser = await prisma.user.upsert({
      where: {
        email: 'admin@nmc.edu.pk',
      },
      update: {},
      create: {
        email: 'admin@nmc.edu.pk',
        passwordHash: '$2b$10$vI8aWBnW3fID.ZQ49oZg4.q4nN9F03XQ5VzTz2WpW1F2zP1P.P9.m',
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+923001234567',
        status: UserStatus.ACTIVE,
        roles: {
          create: {
            roleId: superAdminRole.id,
          },
        },
      },
    });
    console.log(`✅ Default Super Admin created: ${adminUser.email}`);
  }

  console.log('🎉 PERN ERP Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
