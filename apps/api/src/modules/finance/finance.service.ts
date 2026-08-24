import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FeeType, PaymentStatus, PaymentMethod } from '@prisma/client';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'finance:structures:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['finance'],
  })
  async getFeeStructures(programId?: string) {
    return this.prisma.feeStructure.findMany({
      where: {
        ...(programId ? { programId } : {}),
      },
      include: {
        program: true,
        semester: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayments(studentId?: string, status?: PaymentStatus) {
    return this.prisma.payment.findMany({
      where: {
        ...(studentId ? { studentId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        student: { include: { user: true, program: true } },
        feeStructure: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @CacheEvict({
    tags: ['finance'],
  })
  async createFeeStructure(data: {
    programId: string;
    semesterId?: string;
    name: string;
    description?: string;
    amount: number;
    feeType: FeeType;
    dueDate?: Date;
  }) {
    return this.prisma.feeStructure.create({
      data: {
        programId: data.programId,
        semesterId: data.semesterId,
        name: data.name,
        description: data.description,
        amount: data.amount,
        feeType: data.feeType,
        dueDate: data.dueDate,
      },
    });
  }

  @CacheEvict({
    tags: ['finance'],
  })
  async recordPayment(data: {
    studentId: string;
    feeStructureId: string;
    invoiceNumber: string;
    amount: number;
    paidAmount: number;
    method?: PaymentMethod;
    transactionId?: string;
    status?: PaymentStatus;
    notes?: string;
  }) {
    return this.prisma.payment.create({
      data: {
        studentId: data.studentId,
        feeStructureId: data.feeStructureId,
        invoiceNumber: data.invoiceNumber,
        amount: data.amount,
        paidAmount: data.paidAmount,
        method: data.method,
        transactionId: data.transactionId,
        status: data.status || (data.paidAmount >= data.amount ? PaymentStatus.PAID : PaymentStatus.PARTIAL),
        paidAt: data.paidAmount > 0 ? new Date() : null,
        notes: data.notes,
      },
    });
  }

  async getSummaryMetrics() {
    const totalCollected = await this.prisma.payment.aggregate({
      _sum: { paidAmount: true },
    });
    const pendingInvoices = await this.prisma.payment.count({
      where: { status: PaymentStatus.PENDING },
    });
    const paidInvoices = await this.prisma.payment.count({
      where: { status: PaymentStatus.PAID },
    });
    return {
      totalRevenue: totalCollected._sum.paidAmount || 0,
      pendingInvoices,
      paidInvoices,
    };
  }
}
