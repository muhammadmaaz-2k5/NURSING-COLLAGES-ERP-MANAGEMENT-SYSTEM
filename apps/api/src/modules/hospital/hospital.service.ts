import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from '../../common/database/transaction.service';
import { AuditService } from '../../common/audit/audit.service';
import { JobsService } from '../../common/jobs/jobs.service';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';
import {
  BedStatus,
  HospitalBedType,
  HospitalDepartmentType,
  AppointmentStatus,
  PrescriptionStatus,
  LabTestStatus,
  PatientStatus,
  Gender,
} from '@prisma/client';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateDoctorDto {
  name: string;
  departmentId?: string;
  employeeId?: string;
  specialization?: string;
  qualification?: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
  availability?: string;
}

export interface CreatePatientDto {
  patientNo?: string;
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
  vitalSigns?: Record<string, any>;
  followUpDate?: string;
}

export interface CreateAdmissionDto {
  patientId: string;
  bedId: string;
  diagnosis?: string;
  notes?: string;
}

export interface DischargePatientDto {
  dischargeSummary?: string;
}

export interface CreatePrescriptionDto {
  patientId: string;
  doctorId: string;
  prescriptionNo?: string;
  diagnosis?: string;
  notes?: string;
  items: {
    medicineName: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }[];
}

@Injectable()
export class HospitalService {
  private readonly logger = new Logger(HospitalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  private async getOrCreateHospital() {
    let hospital = await this.prisma.hospital.findFirst();
    if (!hospital) {
      hospital = await this.prisma.hospital.create({
        data: {
          name: 'Teaching & Allied General Hospital',
          code: 'TAGH-01',
          city: 'Islamabad',
        },
      });
    }
    return hospital;
  }

  // ----------------------------------------------------
  // PROFILE & STATS
  // ----------------------------------------------------

  @Cacheable({
    key: 'hospital:profile:overview',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['hospital'],
  })
  async getHospitalProfile() {
    const hospital = await this.getOrCreateHospital();
    const [departments, wards, beds, doctorsCount, patientsCount, activeAdmissionsCount, todayAppointmentsCount] =
      await Promise.all([
        this.prisma.hospitalDepartment.findMany({ where: { hospitalId: hospital.id }, include: { _count: { select: { doctors: true, wards: true } } } }),
        this.prisma.hospitalWard.findMany({ where: { hospitalId: hospital.id }, include: { beds: true, department: true } }),
        this.prisma.hospitalBed.findMany({ where: { ward: { hospitalId: hospital.id } } }),
        this.prisma.doctor.count({ where: { hospitalId: hospital.id, isActive: true } }),
        this.prisma.patient.count({ where: { hospitalId: hospital.id } }),
        this.prisma.patientAdmission.count({ where: { dischargedAt: null } }),
        this.prisma.appointment.count({
          where: {
            hospitalId: hospital.id,
            appointmentDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),
      ]);

    const totalBeds = beds.length;
    const occupiedBeds = beds.filter((b) => b.status === BedStatus.OCCUPIED).length;
    const availableBeds = beds.filter((b) => b.status === BedStatus.AVAILABLE).length;
    const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : '0';

    return {
      hospital,
      departments,
      wards,
      metrics: {
        totalBeds,
        occupiedBeds,
        availableBeds,
        occupancyRate: `${occupancyRate}%`,
        activeDoctors: doctorsCount,
        registeredPatients: patientsCount,
        currentInpatients: activeAdmissionsCount,
        todayAppointments: todayAppointmentsCount,
      },
    };
  }

  // ----------------------------------------------------
  // DEPARTMENTS, WARDS & BEDS
  // ----------------------------------------------------

  async getDepartments() {
    const hospital = await this.getOrCreateHospital();
    return this.prisma.hospitalDepartment.findMany({
      where: { hospitalId: hospital.id },
      include: {
        doctors: true,
        wards: { include: { beds: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({ tags: ['hospital'] })
  async createDepartment(data: { name: string; type: HospitalDepartmentType; description?: string }) {
    const hospital = await this.getOrCreateHospital();
    return this.prisma.hospitalDepartment.create({
      data: {
        hospitalId: hospital.id,
        name: data.name,
        type: data.type,
        description: data.description,
      },
    });
  }

  async getWards() {
    const hospital = await this.getOrCreateHospital();
    return this.prisma.hospitalWard.findMany({
      where: { hospitalId: hospital.id },
      include: {
        department: true,
        beds: {
          include: {
            patientAdmissions: {
              where: { dischargedAt: null },
              include: { patient: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({ tags: ['hospital'] })
  async createWard(data: { name: string; departmentId?: string; floor?: string; capacity?: number }) {
    const hospital = await this.getOrCreateHospital();
    return this.prisma.hospitalWard.create({
      data: {
        hospitalId: hospital.id,
        name: data.name,
        departmentId: data.departmentId,
        floor: data.floor,
        capacity: data.capacity || 10,
      },
    });
  }

  @CacheEvict({ tags: ['hospital'] })
  async createBed(data: { wardId: string; bedNumber: string; type?: HospitalBedType }) {
    const ward = await this.prisma.hospitalWard.findUnique({ where: { id: data.wardId } });
    if (!ward) throw new NotFoundException('Ward not found');

    return this.prisma.hospitalBed.create({
      data: {
        wardId: data.wardId,
        bedNumber: data.bedNumber,
        type: data.type || HospitalBedType.GENERAL,
        status: BedStatus.AVAILABLE,
      },
    });
  }

  // ----------------------------------------------------
  // DOCTORS
  // ----------------------------------------------------

  async getDoctors(departmentId?: string, isActive?: boolean) {
    const hospital = await this.getOrCreateHospital();
    return this.prisma.doctor.findMany({
      where: {
        hospitalId: hospital.id,
        ...(departmentId ? { departmentId } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      include: {
        department: true,
        _count: { select: { appointments: true, consultations: true, prescriptions: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({ tags: ['hospital'] })
  async createDoctor(dto: CreateDoctorDto) {
    const hospital = await this.getOrCreateHospital();
    return this.prisma.doctor.create({
      data: {
        hospitalId: hospital.id,
        name: dto.name,
        departmentId: dto.departmentId,
        employeeId: dto.employeeId,
        specialization: dto.specialization,
        qualification: dto.qualification,
        licenseNumber: dto.licenseNumber,
        phone: dto.phone,
        email: dto.email,
        availability: dto.availability,
        isActive: true,
      },
      include: { department: true },
    });
  }

  // ----------------------------------------------------
  // PATIENTS
  // ----------------------------------------------------

  async getPatients(query: { search?: string; status?: PatientStatus; page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const hospital = await this.getOrCreateHospital();
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { hospitalId: hospital.id };
    if (query.status) where.status = query.status;

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { patientNo: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.patient.count({ where }),
      this.prisma.patient.findMany({
        where,
        include: {
          appointments: { take: 3, orderBy: { appointmentDate: 'desc' }, include: { doctor: true } },
          admissions: { where: { dischargedAt: null }, include: { bed: { include: { ward: true } } } },
          _count: { select: { prescriptions: true, labTests: true, consultations: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  async getPatientById(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: { orderBy: { appointmentDate: 'desc' }, include: { doctor: true, department: true } },
        consultations: { orderBy: { createdAt: 'desc' }, include: { doctor: true } },
        prescriptions: { orderBy: { date: 'desc' }, include: { doctor: true, items: true } },
        admissions: { orderBy: { admittedAt: 'desc' }, include: { bed: { include: { ward: true } } } },
        labTests: { orderBy: { requestedAt: 'desc' } },
      },
    });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  @CacheEvict({ tags: ['hospital'] })
  async createPatient(dto: CreatePatientDto, creatorId?: string) {
    const hospital = await this.getOrCreateHospital();

    // Auto-generate MRN if not supplied
    let patientNo = dto.patientNo;
    if (!patientNo) {
      const count = await this.prisma.patient.count({ where: { hospitalId: hospital.id } });
      patientNo = `MRN-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    }

    const patient = await this.prisma.patient.create({
      data: {
        hospitalId: hospital.id,
        patientNo,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        bloodGroup: dto.bloodGroup,
        emergencyContact: dto.emergencyContact,
        emergencyPhone: dto.emergencyPhone,
        allergies: dto.allergies,
        medicalHistory: dto.medicalHistory,
        status: PatientStatus.ACTIVE,
      },
    });

    await this.auditService.log({
      userId: creatorId,
      action: 'PATIENT_CREATE',
      entity: 'Patient',
      entityId: patient.id,
      newData: { patientNo, name: `${dto.firstName} ${dto.lastName || ''}` },
    });

    return patient;
  }

  // ----------------------------------------------------
  // OPD: APPOINTMENTS & CONSULTATIONS
  // ----------------------------------------------------

  async getAppointments(query: { doctorId?: string; patientId?: string; date?: string; status?: AppointmentStatus }) {
    const hospital = await this.getOrCreateHospital();
    const where: any = { hospitalId: hospital.id };
    if (query.doctorId) where.doctorId = query.doctorId;
    if (query.patientId) where.patientId = query.patientId;
    if (query.status) where.status = query.status;

    if (query.date) {
      const targetDate = new Date(query.date);
      where.appointmentDate = {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lte: new Date(targetDate.setHours(23, 59, 59, 999)),
      };
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
        department: true,
        consultation: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  @CacheEvict({ tags: ['hospital'] })
  async createAppointment(dto: CreateAppointmentDto, creatorId?: string) {
    const hospital = await this.getOrCreateHospital();
    const [patient, doctor] = await Promise.all([
      this.prisma.patient.findUnique({ where: { id: dto.patientId } }),
      this.prisma.doctor.findUnique({ where: { id: dto.doctorId } }),
    ]);

    if (!patient) throw new NotFoundException('Patient record not found');
    if (!doctor) throw new NotFoundException('Doctor not found');
    if (!doctor.isActive) throw new BadRequestException('Selected doctor is currently inactive');

    const appointmentDate = new Date(dto.appointmentDate);

    // Get today's token sequence for the doctor
    const count = await this.prisma.appointment.count({
      where: {
        doctorId: dto.doctorId,
        appointmentDate: {
          gte: new Date(new Date(appointmentDate).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(appointmentDate).setHours(23, 59, 59, 999)),
        },
      },
    });

    const appointment = await this.prisma.appointment.create({
      data: {
        hospitalId: hospital.id,
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        departmentId: dto.departmentId || doctor.departmentId,
        appointmentDate,
        tokenNumber: count + 1,
        reason: dto.reason,
        notes: dto.notes,
        status: AppointmentStatus.SCHEDULED,
      },
      include: { patient: true, doctor: true, department: true },
    });

    await this.auditService.log({
      userId: creatorId,
      action: 'APPOINTMENT_CREATE',
      entity: 'Appointment',
      entityId: appointment.id,
      newData: { patientNo: patient.patientNo, doctorName: doctor.name, appointmentDate },
    });

    return appointment;
  }

  @CacheEvict({ tags: ['hospital'] })
  async createConsultation(dto: CreateConsultationDto, doctorUserId?: string) {
    const hospital = await this.getOrCreateHospital();
    const [patient, doctor] = await Promise.all([
      this.prisma.patient.findUnique({ where: { id: dto.patientId } }),
      this.prisma.doctor.findUnique({ where: { id: dto.doctorId } }),
    ]);

    if (!patient) throw new NotFoundException('Patient record not found');
    if (!doctor) throw new NotFoundException('Doctor record not found');

    return this.txService.executeWithTransaction(async (tx) => {
      const consultation = await tx.consultation.create({
        data: {
          hospitalId: hospital.id,
          appointmentId: dto.appointmentId,
          patientId: dto.patientId,
          doctorId: dto.doctorId,
          symptoms: dto.symptoms,
          diagnosis: dto.diagnosis,
          clinicalNotes: dto.clinicalNotes,
          vitalSigns: dto.vitalSigns,
          followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : undefined,
        },
        include: { patient: true, doctor: true },
      });

      if (dto.appointmentId) {
        await tx.appointment.update({
          where: { id: dto.appointmentId },
          data: { status: AppointmentStatus.COMPLETED },
        });
      }

      await this.auditService.log({
        userId: doctorUserId,
        action: 'CONSULTATION_CREATE',
        entity: 'Consultation',
        entityId: consultation.id,
        newData: { patientId: dto.patientId, diagnosis: dto.diagnosis },
      });

      return consultation;
    });
  }

  // ----------------------------------------------------
  // IPD: ADMISSIONS, TRANSFERS & DISCHARGES (TRANSACTIONAL BED LOCK)
  // ----------------------------------------------------

  /**
   * Invariant: Never allow two active patients to occupy the same bed simultaneously.
   */
  @CacheEvict({ tags: ['hospital'] })
  async admitPatient(dto: CreateAdmissionDto, userId?: string) {
    const [patient, bed] = await Promise.all([
      this.prisma.patient.findUnique({ where: { id: dto.patientId } }),
      this.prisma.hospitalBed.findUnique({ where: { id: dto.bedId }, include: { ward: true } }),
    ]);

    if (!patient) throw new NotFoundException('Patient record not found');
    if (!bed) throw new NotFoundException('Bed record not found');

    return this.txService.executeWithTransaction(async (tx) => {
      // 1. Check if patient is already admitted
      const existingPatientAdmission = await tx.patientAdmission.findFirst({
        where: { patientId: dto.patientId, dischargedAt: null },
      });
      if (existingPatientAdmission) {
        throw new ConflictException('Patient is already admitted to another hospital bed');
      }

      // 2. Check bed availability and active occupant
      const currentBedOccupant = await tx.patientAdmission.findFirst({
        where: { bedId: dto.bedId, dischargedAt: null },
      });
      if (currentBedOccupant || bed.status === BedStatus.OCCUPIED) {
        throw new ConflictException(
          `Bed ${bed.bedNumber} in ${bed.ward.name} is currently occupied by another active patient`,
        );
      }

      // 3. Create admission record
      const admission = await tx.patientAdmission.create({
        data: {
          patientId: dto.patientId,
          bedId: dto.bedId,
          admittedAt: new Date(),
          diagnosis: dto.diagnosis,
          notes: dto.notes,
        },
        include: { patient: true, bed: { include: { ward: true } } },
      });

      // 4. Update bed status to OCCUPIED
      await tx.hospitalBed.update({
        where: { id: dto.bedId },
        data: { status: BedStatus.OCCUPIED },
      });

      await this.auditService.log({
        userId,
        action: 'PATIENT_ADMIT',
        entity: 'PatientAdmission',
        entityId: admission.id,
        newData: {
          patientNo: patient.patientNo,
          bedNumber: bed.bedNumber,
          wardName: bed.ward.name,
        },
      });

      return admission;
    });
  }

  /**
   * Transfer patient from one bed to another atomically
   */
  @CacheEvict({ tags: ['hospital'] })
  async transferPatientBed(admissionId: string, targetBedId: string, userId?: string) {
    return this.txService.executeWithTransaction(async (tx) => {
      const admission = await tx.patientAdmission.findUnique({
        where: { id: admissionId },
        include: { bed: true, patient: true },
      });
      if (!admission || admission.dischargedAt !== null) {
        throw new NotFoundException('Active inpatient admission not found');
      }

      const targetBed = await tx.hospitalBed.findUnique({
        where: { id: targetBedId },
        include: { ward: true },
      });
      if (!targetBed) throw new NotFoundException('Target bed not found');

      // Check target bed availability
      const targetOccupant = await tx.patientAdmission.findFirst({
        where: { bedId: targetBedId, dischargedAt: null },
      });
      if (targetOccupant || targetBed.status === BedStatus.OCCUPIED) {
        throw new ConflictException(`Target bed ${targetBed.bedNumber} is currently occupied`);
      }

      // Release old bed
      await tx.hospitalBed.update({
        where: { id: admission.bedId },
        data: { status: BedStatus.AVAILABLE },
      });

      // Occupy new bed
      await tx.hospitalBed.update({
        where: { id: targetBedId },
        data: { status: BedStatus.OCCUPIED },
      });

      // Update admission record
      const updated = await tx.patientAdmission.update({
        where: { id: admissionId },
        data: { bedId: targetBedId },
        include: { patient: true, bed: { include: { ward: true } } },
      });

      await this.auditService.log({
        userId,
        action: 'PATIENT_BED_TRANSFER',
        entity: 'PatientAdmission',
        entityId: admissionId,
        oldData: { bedId: admission.bedId },
        newData: { bedId: targetBedId, targetBed: targetBed.bedNumber },
      });

      return updated;
    });
  }

  /**
   * Discharge patient and release bed back to AVAILABLE status
   */
  @CacheEvict({ tags: ['hospital'] })
  async dischargePatient(admissionId: string, dto: DischargePatientDto, userId?: string) {
    return this.txService.executeWithTransaction(async (tx) => {
      const admission = await tx.patientAdmission.findUnique({
        where: { id: admissionId },
        include: { bed: true, patient: true },
      });
      if (!admission) throw new NotFoundException('Admission record not found');
      if (admission.dischargedAt !== null) {
        throw new BadRequestException('Patient is already discharged from this admission');
      }

      // 1. Mark admission discharged
      const discharged = await tx.patientAdmission.update({
        where: { id: admissionId },
        data: {
          dischargedAt: new Date(),
          dischargeSummary: dto.dischargeSummary,
        },
        include: { patient: true, bed: { include: { ward: true } } },
      });

      // 2. Release bed to AVAILABLE
      await tx.hospitalBed.update({
        where: { id: admission.bedId },
        data: { status: BedStatus.AVAILABLE },
      });

      // 3. Mark patient as DISCHARGED
      await tx.patient.update({
        where: { id: admission.patientId },
        data: { status: PatientStatus.DISCHARGED },
      });

      await this.auditService.log({
        userId,
        action: 'PATIENT_DISCHARGE',
        entity: 'PatientAdmission',
        entityId: admissionId,
        newData: { patientNo: admission.patient.patientNo, dischargedAt: new Date() },
      });

      return discharged;
    });
  }

  // ----------------------------------------------------
  // PRESCRIPTIONS & LAB ORDERS
  // ----------------------------------------------------

  async getPrescriptions(query: { patientId?: string; doctorId?: string }) {
    const hospital = await this.getOrCreateHospital();
    return this.prisma.prescription.findMany({
      where: {
        hospitalId: hospital.id,
        ...(query.patientId ? { patientId: query.patientId } : {}),
        ...(query.doctorId ? { doctorId: query.doctorId } : {}),
      },
      include: {
        patient: true,
        doctor: true,
        items: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  @CacheEvict({ tags: ['hospital'] })
  async createPrescription(dto: CreatePrescriptionDto, doctorUserId?: string) {
    const hospital = await this.getOrCreateHospital();
    const [patient, doctor] = await Promise.all([
      this.prisma.patient.findUnique({ where: { id: dto.patientId } }),
      this.prisma.doctor.findUnique({ where: { id: dto.doctorId } }),
    ]);

    if (!patient) throw new NotFoundException('Patient record not found');
    if (!doctor) throw new NotFoundException('Doctor not found');

    let prescriptionNo = dto.prescriptionNo;
    if (!prescriptionNo) {
      const count = await this.prisma.prescription.count({ where: { hospitalId: hospital.id } });
      prescriptionNo = `RX-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    }

    const prescription = await this.prisma.prescription.create({
      data: {
        hospitalId: hospital.id,
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        prescriptionNo,
        diagnosis: dto.diagnosis,
        notes: dto.notes,
        status: PrescriptionStatus.ACTIVE,
        items: {
          create: dto.items,
        },
      },
      include: { patient: true, doctor: true, items: true },
    });

    await this.auditService.log({
      userId: doctorUserId,
      action: 'PRESCRIPTION_CREATE',
      entity: 'Prescription',
      entityId: prescription.id,
      newData: { prescriptionNo, patientNo: patient.patientNo, itemCount: dto.items.length },
    });

    return prescription;
  }

  async getLabTests(query: { patientId?: string; status?: LabTestStatus }) {
    const hospital = await this.getOrCreateHospital();
    return this.prisma.labTest.findMany({
      where: {
        hospitalId: hospital.id,
        ...(query.patientId ? { patientId: query.patientId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      include: { patient: true },
      orderBy: { requestedAt: 'desc' },
    });
  }

  @CacheEvict({ tags: ['hospital'] })
  async orderLabTest(data: { patientId: string; testName: string }, userId?: string) {
    const hospital = await this.getOrCreateHospital();
    const patient = await this.prisma.patient.findUnique({ where: { id: data.patientId } });
    if (!patient) throw new NotFoundException('Patient not found');

    return this.prisma.labTest.create({
      data: {
        hospitalId: hospital.id,
        patientId: data.patientId,
        testName: data.testName,
        status: LabTestStatus.REQUESTED,
      },
      include: { patient: true },
    });
  }

  @CacheEvict({ tags: ['hospital'] })
  async updateLabTestResult(
    id: string,
    data: { result: string; normalRange?: string; remarks?: string; status?: LabTestStatus },
    userId?: string,
  ) {
    const labTest = await this.prisma.labTest.findUnique({ where: { id } });
    if (!labTest) throw new NotFoundException('Lab test order not found');

    return this.prisma.labTest.update({
      where: { id },
      data: {
        result: data.result,
        normalRange: data.normalRange,
        remarks: data.remarks,
        status: data.status || LabTestStatus.COMPLETED,
        completedAt: new Date(),
      },
      include: { patient: true },
    });
  }
}

