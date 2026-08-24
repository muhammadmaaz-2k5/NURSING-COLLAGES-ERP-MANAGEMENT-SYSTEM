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
  FeeType,
  PaymentStatus,
  PaymentMethod,
  ScholarshipType,
  Prisma,
} from '@prisma/client';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateFeeStructureDto {
  programId: string;
  semesterId?: string;
  name: string;
  description?: string;
  amount: number;
  feeType: FeeType;
  dueDate?: string;
  isActive?: boolean;
}

export interface GenerateInvoiceDto {
  studentId: string;
  feeStructureId: string;
  customAmount?: number;
  dueDate?: string;
  notes?: string;
}

export interface RecordPaymentDto {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface CreateScholarshipDto {
  name: string;
  description?: string;
  type: ScholarshipType;
  percentage?: number;
  fixedAmount?: number;
}

export interface AssignScholarshipDto {
  studentId: string;
  scholarshipId: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  // ----------------------------------------------------
  // FEE STRUCTURES
  // ----------------------------------------------------

  @Cacheable({
    key: 'finance:feestructures:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['finance', 'feestructures'],
  })
  async getFeeStructures(query: { programId?: string; semesterId?: string; feeType?: FeeType; isActive?: boolean }) {
    return this.prisma.feeStructure.findMany({
      where: {
        ...(query.programId ? { programId: query.programId } : {}),
        ...(query.semesterId ? { semesterId: query.semesterId } : {}),
        ...(query.feeType ? { feeType: query.feeType } : {}),
        ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      },
      include: {
        program: true,
        semester: true,
        _count: { select: { payments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @CacheEvict({ tags: ['finance', 'feestructures'] })
  async createFeeStructure(dto: CreateFeeStructureDto) {
    const program = await this.prisma.program.findUnique({ where: { id: dto.programId } });
    if (!program) throw new NotFoundException('Program not found');

    return this.prisma.feeStructure.create({
      data: {
        programId: dto.programId,
        semesterId: dto.semesterId,
        name: dto.name,
        description: dto.description,
        amount: new Prisma.Decimal(dto.amount),
        feeType: dto.feeType,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
      include: { program: true, semester: true },
    });
  }

  // ----------------------------------------------------
  // STUDENT INVOICES & CHALLANS
  // ----------------------------------------------------

  @CacheEvict({ tags: ['finance', 'payments'] })
  async generateInvoice(dto: GenerateInvoiceDto, generatorId?: string) {
    const [student, feeStructure] = await Promise.all([
      this.prisma.student.findUnique({
        where: { id: dto.studentId },
        include: { user: true, scholarships: { include: { scholarship: true } } },
      }),
      this.prisma.feeStructure.findUnique({ where: { id: dto.feeStructureId } }),
    ]);

    if (!student) throw new NotFoundException('Student not found');
    if (!feeStructure) throw new NotFoundException('Fee structure not found');

    const year = new Date().getFullYear();
    const count = await this.prisma.payment.count();
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, '0')}`;

    let baseAmount = dto.customAmount !== undefined ? dto.customAmount : Number(feeStructure.amount);

    // Apply active scholarship discounts if applicable to TUITION
    if (feeStructure.feeType === FeeType.TUITION && student.scholarships.length > 0) {
      for (const s of student.scholarships) {
        if (s.scholarship.percentage) {
          const discount = (baseAmount * s.scholarship.percentage) / 100;
          baseAmount = Math.max(0, baseAmount - discount);
          this.logger.debug(`[SCHOLARSHIP] Applied ${s.scholarship.percentage}% discount (${discount} PKR) to student ${student.studentId}`);
        } else if (s.scholarship.fixedAmount) {
          baseAmount = Math.max(0, baseAmount - Number(s.scholarship.fixedAmount));
        }
      }
    }

    const invoice = await this.prisma.payment.create({
      data: {
        studentId: dto.studentId,
        feeStructureId: dto.feeStructureId,
        invoiceNumber,
        amount: new Prisma.Decimal(baseAmount),
        paidAmount: new Prisma.Decimal(0),
        status: PaymentStatus.PENDING,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : feeStructure.dueDate,
        notes: dto.notes,
      },
      include: { student: { include: { user: true } }, feeStructure: true },
    });

    await this.auditService.log({
      userId: generatorId,
      action: 'INVOICE_GENERATE',
      entity: 'Payment',
      entityId: invoice.id,
      newData: { invoiceNumber, studentId: dto.studentId, amount: baseAmount },
    });

    // Notify student via BullMQ
    await this.jobsService.dispatchNotification({
      userId: student.userId,
      title: `Fee Challan Generated: ${invoiceNumber}`,
      message: `A fee challan of PKR ${baseAmount.toLocaleString()} has been generated for ${feeStructure.name}. Due date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}.`,
      type: 'FINANCE',
    });

    return invoice;
  }

  async getInvoices(query: { studentId?: string; status?: PaymentStatus; feeStructureId?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;
    if (query.feeStructureId) where.feeStructureId = query.feeStructureId;

    const [total, data] = await Promise.all([
      this.prisma.payment.count({ where }),
      this.prisma.payment.findMany({
        where,
        include: {
          student: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
              program: { select: { name: true, code: true } },
            },
          },
          feeStructure: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  // ----------------------------------------------------
  // ATOMIC PAYMENT RECORDING & REVERSALS
  // ----------------------------------------------------

  @CacheEvict({ tags: ['finance', 'payments'] })
  async recordPayment(dto: RecordPaymentDto, cashierId?: string) {
    return this.txService.run(async (tx) => {
      const invoice = await tx.payment.findUnique({
        where: { id: dto.invoiceId },
        include: { student: { include: { user: true } }, feeStructure: true },
      });

      if (!invoice) throw new NotFoundException('Invoice not found');
      if (invoice.status === PaymentStatus.PAID) {
        throw new BadRequestException('Invoice is already fully paid');
      }
      if (invoice.status === PaymentStatus.CANCELLED) {
        throw new BadRequestException('Cannot make payments against a cancelled invoice');
      }

      const currentPaid = Number(invoice.paidAmount);
      const totalRequired = Number(invoice.amount);
      const newPaidAmount = currentPaid + dto.amount;

      if (newPaidAmount > totalRequired) {
        throw new BadRequestException(
          `Payment amount (${dto.amount}) exceeds outstanding balance (${totalRequired - currentPaid})`,
        );
      }

      const newStatus = newPaidAmount >= totalRequired ? PaymentStatus.PAID : PaymentStatus.PARTIAL;

      const updated = await tx.payment.update({
        where: { id: dto.invoiceId },
        data: {
          paidAmount: new Prisma.Decimal(newPaidAmount),
          status: newStatus,
          method: dto.method,
          transactionId: dto.transactionId,
          paidAt: new Date(),
          notes: dto.notes ? `${invoice.notes || ''} | ${dto.notes}`.trim() : invoice.notes,
        },
        include: { student: { include: { user: true } }, feeStructure: true },
      });

      await this.auditService.log({
        userId: cashierId,
        action: 'PAYMENT_RECORD',
        entity: 'Payment',
        entityId: invoice.id,
        newData: {
          invoiceNumber: invoice.invoiceNumber,
          amountPaid: dto.amount,
          totalPaid: newPaidAmount,
          method: dto.method,
          transactionId: dto.transactionId,
        },
      });

      // Queue asynchronous PDF Receipt Generation via BullMQ
      await this.jobsService.dispatchPdfGeneration({
        type: 'FEE_CHALLAN',
        entityId: invoice.id,
        outputName: `receipt_${invoice.invoiceNumber}`,
        data: {
          invoiceNumber: invoice.invoiceNumber,
          studentName: `${invoice.student.user.firstName} ${invoice.student.user.lastName || ''}`.trim(),
          amount: dto.amount,
          totalAmount: totalRequired,
          method: dto.method,
          transactionId: dto.transactionId,
          date: new Date().toISOString(),
        },
      });

      // Dispatch Payment Confirmation Notification via BullMQ
      await this.jobsService.dispatchNotification({
        userId: invoice.student.userId,
        title: `Payment Received: PKR ${dto.amount.toLocaleString()}`,
        message: `Payment of PKR ${dto.amount.toLocaleString()} received for Challan ${invoice.invoiceNumber}. Remaining balance: PKR ${(totalRequired - newPaidAmount).toLocaleString()}.`,
        type: 'FINANCE',
      });

      return updated;
    });
  }

  @CacheEvict({ tags: ['finance', 'payments'] })
  async reversePayment(invoiceId: string, reason: string, cashierId?: string) {
    return this.txService.run(async (tx) => {
      const invoice = await tx.payment.findUnique({
        where: { id: invoiceId },
        include: { student: true },
      });

      if (!invoice) throw new NotFoundException('Invoice not found');
      if (Number(invoice.paidAmount) <= 0) {
        throw new BadRequestException('No payments have been recorded for this invoice to reverse');
      }

      const oldPaid = Number(invoice.paidAmount);

      const updated = await tx.payment.update({
        where: { id: invoiceId },
        data: {
          paidAmount: new Prisma.Decimal(0),
          status: PaymentStatus.REFUNDED,
          notes: `${invoice.notes || ''} | REVERSAL: ${reason}`.trim(),
        },
      });

      await this.auditService.log({
        userId: cashierId,
        action: 'PAYMENT_REVERSE',
        entity: 'Payment',
        entityId: invoiceId,
        oldData: { paidAmount: oldPaid, status: invoice.status },
        newData: { paidAmount: 0, status: PaymentStatus.REFUNDED, reason },
      });

      return updated;
    });
  }

  // ----------------------------------------------------
  // SCHOLARSHIPS & CONCESSIONS
  // ----------------------------------------------------

  async createScholarship(dto: CreateScholarshipDto) {
    return this.prisma.scholarship.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        percentage: dto.percentage,
        fixedAmount: dto.fixedAmount !== undefined ? new Prisma.Decimal(dto.fixedAmount) : undefined,
      },
    });
  }

  async getScholarships() {
    return this.prisma.scholarship.findMany({
      include: { _count: { select: { students: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignScholarship(dto: AssignScholarshipDto, assignerId?: string) {
    const [student, scholarship] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: dto.studentId } }),
      this.prisma.scholarship.findUnique({ where: { id: dto.scholarshipId } }),
    ]);

    if (!student) throw new NotFoundException('Student not found');
    if (!scholarship) throw new NotFoundException('Scholarship not found');

    const assignment = await this.prisma.studentScholarship.upsert({
      where: {
        studentId_scholarshipId: {
          studentId: dto.studentId,
          scholarshipId: dto.scholarshipId,
        },
      },
      update: {
        amount: dto.amount !== undefined ? new Prisma.Decimal(dto.amount) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      create: {
        studentId: dto.studentId,
        scholarshipId: dto.scholarshipId,
        amount: dto.amount !== undefined ? new Prisma.Decimal(dto.amount) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: { scholarship: true, student: { include: { user: true } } },
    });

    await this.auditService.log({
      userId: assignerId,
      action: 'SCHOLARSHIP_ASSIGN',
      entity: 'StudentScholarship',
      entityId: assignment.id,
      newData: { studentId: dto.studentId, scholarshipName: scholarship.name },
    });

    return assignment;
  }

  // ----------------------------------------------------
  // FINANCIAL LEDGER & STUDENT STATEMENT
  // ----------------------------------------------------

  async getStudentLedgerStatement(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        program: true,
        scholarships: { include: { scholarship: true } },
        payments: {
          include: { feeStructure: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!student) throw new NotFoundException('Student not found');

    let totalBilled = 0;
    let totalPaid = 0;

    const ledgerEntries = student.payments.map((p) => {
      const billed = Number(p.amount);
      const paid = Number(p.paidAmount);
      const balance = billed - paid;

      totalBilled += billed;
      totalPaid += paid;

      return {
        invoiceNumber: p.invoiceNumber,
        feeType: p.feeStructure.feeType,
        feeName: p.feeStructure.name,
        date: p.createdAt,
        dueDate: p.dueDate,
        billedAmount: billed,
        paidAmount: paid,
        status: p.status,
        paymentMethod: p.method,
        transactionId: p.transactionId,
        paidAt: p.paidAt,
        outstandingBalance: balance,
      };
    });

    const netOutstanding = totalBilled - totalPaid;

    return {
      studentId: student.studentId,
      studentName: `${student.user.firstName} ${student.user.lastName || ''}`.trim(),
      program: student.program.name,
      activeScholarships: student.scholarships.map((s) => ({
        name: s.scholarship.name,
        percentage: s.scholarship.percentage,
        amount: s.scholarship.fixedAmount,
      })),
      totalBilled,
      totalPaid,
      netOutstanding,
      statement: ledgerEntries,
    };
  }

  // ----------------------------------------------------
  // REVENUE REPORTS & ANALYTICS
  // ----------------------------------------------------

  @Cacheable({
    key: 'finance:reports:summary',
    ttl: TTL_PRESETS.SHORT,
    tags: ['finance', 'reports'],
  })
  async getFinancialSummary() {
    const payments = await this.prisma.payment.findMany();

    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let totalRefunded = 0;

    for (const p of payments) {
      totalBilled += Number(p.amount);
      totalCollected += Number(p.paidAmount);

      if (p.status === PaymentStatus.PENDING || p.status === PaymentStatus.PARTIAL) {
        totalPending += Number(p.amount) - Number(p.paidAmount);
      } else if (p.status === PaymentStatus.REFUNDED) {
        totalRefunded += Number(p.amount);
      }
    }

    const scholarshipsCount = await this.prisma.studentScholarship.count();

    return {
      totalBilled,
      totalCollected,
      totalPending,
      totalRefunded,
      collectionRate: totalBilled > 0 ? Number(((totalCollected / totalBilled) * 100).toFixed(1)) : 0,
      activeInvoicesCount: payments.length,
      scholarshipsAwardedCount: scholarshipsCount,
    };
  }
}
