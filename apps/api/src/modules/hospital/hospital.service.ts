import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BedStatus, AppointmentStatus, PrescriptionStatus, LabTestStatus, PatientStatus } from '@prisma/client';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class HospitalService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'hospital:info:current',
    ttl: TTL_PRESETS.LONG,
    tags: ['hospital'],
  })
  async getHospitalProfile() {
    return this.prisma.hospital.findFirst({
      include: {
        departments: true,
        wards: { include: { beds: true } },
        _count: {
          select: { doctors: true, patients: true, appointments: true, labTests: true },
        },
      },
    });
  }

  async getDoctors(departmentId?: string) {
    return this.prisma.doctor.findMany({
      where: {
        ...(departmentId ? { departmentId } : {}),
      },
      include: { department: true },
    });
  }

  async getPatients(search?: string) {
    return this.prisma.patient.findMany({
      where: search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { patientNo: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        appointments: { take: 5, orderBy: { appointmentDate: 'desc' } },
        admissions: { take: 1, orderBy: { admittedAt: 'desc' }, include: { bed: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAppointments(doctorId?: string, date?: string) {
    const targetDate = date ? new Date(date) : undefined;
    return this.prisma.appointment.findMany({
      where: {
        ...(doctorId ? { doctorId } : {}),
        ...(targetDate
          ? {
              appointmentDate: {
                gte: new Date(targetDate.setHours(0, 0, 0, 0)),
                lte: new Date(targetDate.setHours(23, 59, 59, 999)),
              },
            }
          : {}),
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async getWardsAndBeds() {
    return this.prisma.hospitalWard.findMany({
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
    });
  }

  @CacheEvict({
    tags: ['hospital'],
  })
  async createPatient(data: {
    patientNo: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    city?: string;
    bloodGroup?: string;
  }) {
    let hospital = await this.prisma.hospital.findFirst();
    if (!hospital) {
      hospital = await this.prisma.hospital.create({
        data: { name: 'Teaching Hospital', code: 'TH-01' },
      });
    }

    return this.prisma.patient.create({
      data: {
        hospitalId: hospital.id,
        patientNo: data.patientNo,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        city: data.city,
        bloodGroup: data.bloodGroup,
      },
    });
  }

  async createPrescription(data: {
    patientId: string;
    doctorId: string;
    prescriptionNo: string;
    diagnosis?: string;
    notes?: string;
    items: { medicineName: string; dosage?: string; frequency?: string; duration?: string; instructions?: string }[];
  }) {
    let hospital = await this.prisma.hospital.findFirst();
    if (!hospital) {
      hospital = await this.prisma.hospital.create({
        data: { name: 'Teaching Hospital', code: 'TH-01' },
      });
    }

    return this.prisma.prescription.create({
      data: {
        hospitalId: hospital.id,
        patientId: data.patientId,
        doctorId: data.doctorId,
        prescriptionNo: data.prescriptionNo,
        diagnosis: data.diagnosis,
        notes: data.notes,
        items: {
          create: data.items,
        },
      },
      include: { items: true },
    });
  }
}
