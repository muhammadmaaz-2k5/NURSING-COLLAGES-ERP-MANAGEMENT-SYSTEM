import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdmissionStatus } from '@prisma/client';

@Injectable()
export class AdmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getApplications(status?: AdmissionStatus) {
    return this.prisma.admissionApplication.findMany({
      where: {
        ...(status ? { status } : {}),
      },
      include: {
        program: true,
        documents: true,
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async getStats() {
    const total = await this.prisma.admissionApplication.count();

    const pending = await this.prisma.admissionApplication.count({
      where: { status: AdmissionStatus.PENDING },
    });

    const approved = await this.prisma.admissionApplication.count({
      where: { status: AdmissionStatus.APPROVED },
    });

    const enrolled = await this.prisma.admissionApplication.count({
      where: { status: AdmissionStatus.ENROLLED },
    });

    return { total, pending, approved, enrolled };
  }
}
