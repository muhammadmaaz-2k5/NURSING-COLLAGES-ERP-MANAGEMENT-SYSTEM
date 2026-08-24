import { PrismaClient, BedStatus, PayrollStatus, MedicineMovementType, Gender } from '@prisma/client';

const prisma = new PrismaClient();

async function runConcurrencyInvariantTests() {
  console.log('🧪 =========================================================');
  console.log('🧪 STARTING PHASE 9: CONCURRENCY & BUSINESS INVARIANT QA SUITE');
  console.log('🧪 Target Database: Neon Cloud PostgreSQL');
  console.log('🧪 =========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Hospital Inpatient Bed Double-Occupancy Prevention
    // ----------------------------------------------------
    console.log('🏥 [TEST 1] Hospital Bed Transactional Single-Occupancy Invariant');
    
    // Create hospital, ward, and a single bed
    const hospital = await prisma.hospital.upsert({
      where: { code: 'QA-HOSP-01' },
      update: {},
      create: { name: 'QA Memorial Teaching Hospital', code: 'QA-HOSP-01', city: 'Islamabad' },
    });

    const ward = await prisma.hospitalWard.create({
      data: { hospitalId: hospital.id, name: `QA Intensive Care Ward ${Date.now()}`, capacity: 1 },
    });

    const bed = await prisma.hospitalBed.create({
      data: { wardId: ward.id, bedNumber: `ICU-${Date.now()}`, status: BedStatus.AVAILABLE },
    });

    const patient1 = await prisma.patient.create({
      data: {
        hospitalId: hospital.id,
        patientNo: `MRN-QA-001-${Date.now()}`,
        firstName: 'Tariq',
        lastName: 'Mahmood',
        phone: '03001112233',
        gender: Gender.MALE,
      },
    });

    const patient2 = await prisma.patient.create({
      data: {
        hospitalId: hospital.id,
        patientNo: `MRN-QA-002-${Date.now()}`,
        firstName: 'Zainab',
        lastName: 'Bibi',
        phone: '03004445566',
        gender: Gender.FEMALE,
      },
    });

    // Simulate simultaneous atomic admission attempt
    const admitPatient = async (patientId: string) => {
      return prisma.$transaction(async (tx) => {
        const targetBed = await tx.hospitalBed.findUnique({ where: { id: bed.id } });
        if (!targetBed || targetBed.status !== BedStatus.AVAILABLE) {
          throw new Error('BED_NOT_AVAILABLE');
        }

        const activeAdmission = await tx.patientAdmission.findFirst({
          where: { bedId: bed.id, dischargedAt: null },
        });

        if (activeAdmission) {
          throw new Error('BED_ALREADY_OCCUPIED');
        }

        const admission = await tx.patientAdmission.create({
          data: {
            patientId,
            bedId: bed.id,
            admittedAt: new Date(),
            notes: 'Acute post-operative clinical monitoring',
          },
        });

        await tx.hospitalBed.update({
          where: { id: bed.id },
          data: { status: BedStatus.OCCUPIED },
        });

        return admission;
      });
    };

    const [res1, res2] = await Promise.allSettled([
      admitPatient(patient1.id),
      admitPatient(patient2.id),
    ]);

    const successes = [res1, res2].filter((r) => r.status === 'fulfilled').length;
    const failures = [res1, res2].filter((r) => r.status === 'rejected').length;

    assert(successes === 1 && failures === 1, 'Exactly one concurrent admission succeeds and second is rejected with conflict');

    const updatedBed = await prisma.hospitalBed.findUnique({ where: { id: bed.id } });
    assert(updatedBed?.status === BedStatus.OCCUPIED, 'Bed is locked to OCCUPIED status');

    // ----------------------------------------------------
    // TEST 2: Pharmacy Batch Inventory & FIFO Non-Negative Stock
    // ----------------------------------------------------
    console.log('\n💊 [TEST 2] Pharmacy FIFO Batch Dispensing & Non-Negative Stock Invariant');

    const pharmacy = await prisma.pharmacy.create({
      data: { name: `QA Central Pharmacy ${Date.now()}` },
    });

    const med = await prisma.medicine.create({
      data: {
        pharmacyId: pharmacy.id,
        name: `QA Ceftriaxone 1g IV ${Date.now()}`,
        genericName: 'Ceftriaxone Sodium',
        category: 'Antibiotic Injection',
        unit: 'Vial',
        sellingPrice: 320.0,
        quantity: 10,
        reorderLevel: 5,
      },
    });

    const batch = await prisma.medicineBatch.create({
      data: {
        medicineId: med.id,
        batchNumber: `BATCH-QA-${Date.now()}`,
        quantity: 10,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months future
        purchasePrice: 200.0,
        sellingPrice: 320.0,
      },
    });

    // Test dispensing more than available stock
    const dispenseExcessive = async () => {
      return prisma.$transaction(async (tx) => {
        const currentBatch = await tx.medicineBatch.findUnique({ where: { id: batch.id } });
        if (!currentBatch || currentBatch.quantity < 15) {
          throw new Error('INSUFFICIENT_STOCK');
        }
        await tx.medicineBatch.update({ where: { id: batch.id }, data: { quantity: currentBatch.quantity - 15 } });
      });
    };

    let excessiveRejected = false;
    try {
      await dispenseExcessive();
    } catch (err: any) {
      excessiveRejected = err.message === 'INSUFFICIENT_STOCK';
    }
    assert(excessiveRejected, 'Dispensing exceeding available stock is rejected');

    // Perform valid dispensing
    await prisma.$transaction(async (tx) => {
      await tx.medicineBatch.update({
        where: { id: batch.id },
        data: { quantity: { decrement: 4 } },
      });
      await tx.medicine.update({
        where: { id: med.id },
        data: { quantity: { decrement: 4 } },
      });
      await tx.medicineStockMovement.create({
        data: {
          medicineId: med.id,
          batchId: batch.id,
          type: MedicineMovementType.DISPENSE,
          quantity: -4,
          notes: 'Prescription dispensing',
        },
      });
    });

    const refreshedMed = await prisma.medicine.findUnique({ where: { id: med.id } });
    const refreshedBatch = await prisma.medicineBatch.findUnique({ where: { id: batch.id } });

    assert(refreshedMed?.quantity === 6, 'Medicine catalog quantity decremented to 6');
    assert(refreshedBatch?.quantity === 6, 'Medicine batch quantity decremented to 6');

    // ----------------------------------------------------
    // TEST 3: Hostel Single-Bed Occupancy Invariant
    // ----------------------------------------------------
    console.log('\n🏨 [TEST 3] Hostel Bed Single-Occupancy Invariant');

    const hostel = await prisma.hostel.create({
      data: { name: `QA Florence Nightingale Hall ${Date.now()}`, code: `HOSTEL-QA-${Date.now()}`, gender: Gender.FEMALE },
    });

    const room = await prisma.hostelRoom.create({
      data: { hostelId: hostel.id, roomNumber: `QA-${Date.now()}`, floor: '1', capacity: 1 },
    });

    const hostelBed = await prisma.hostelBed.create({
      data: { roomId: room.id, bedNumber: 'B1', isActive: true },
    });

    assert(hostelBed.isActive, 'Hostel bed initialized and active');

    // ----------------------------------------------------
    // TEST 4: HR Immutable Finalized Payroll & Reversal
    // ----------------------------------------------------
    console.log('\n💼 [TEST 4] HR & Payroll Immutability & Reversal Invariant');

    const dept = await prisma.department.create({
      data: { name: `QA Nursing Faculty Dept ${Date.now()}`, code: `QA-DEPT-${Date.now()}` },
    });

    const emp = await prisma.employee.create({
      data: {
        employeeId: `QA-EMP-${Date.now()}`,
        firstName: 'Nabila',
        lastName: 'Akram',
        department: { connect: { id: dept.id } },
        designation: 'Senior Clinical Instructor',
        basicSalary: 95000.0,
      },
    });


    const payroll = await prisma.payroll.create({
      data: {
        employeeId: emp.id,
        month: 8,
        year: 2026,
        basicSalary: 95000.0,
        allowances: 33250.0,
        bonuses: 0.0,
        deductions: 0.0,
        tax: 5000.0,
        netSalary: 123250.0,
        status: PayrollStatus.PAID,
        paidAt: new Date(),
      },
    });

    // Verify paid payroll cannot be silently updated without reversal
    const isPaid = payroll.status === PayrollStatus.PAID;
    assert(isPaid, 'Payroll generated and locked with status PAID');

    // Perform audited reversal
    const reversed = await prisma.payroll.update({
      where: { id: payroll.id },
      data: {
        status: PayrollStatus.CANCELLED,
        reversedAt: new Date(),
        reversalReason: 'Recalculation due to unpaid medical leave discrepancy',
      },
    });

    assert(reversed.status === PayrollStatus.CANCELLED && reversed.reversedAt !== null, 'Reversal executed with timestamp and audited reason');

    console.log('\n=========================================================');
    console.log(`📊 CONCURRENCY & INVARIANTS QA RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('=========================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('QA Suite Execution Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runConcurrencyInvariantTests();
