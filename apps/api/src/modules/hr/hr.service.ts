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
import { EmploymentStatus, LeaveStatus, LeaveType, PayrollStatus } from '@prisma/client';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateEmployeeDto {
  userId?: string;
  departmentId?: string;
  employeeId?: string;
  firstName: string;
  lastName?: string;
  designation: string;
  qualification?: string;
  joiningDate?: string;
  status?: EmploymentStatus;
  phone?: string;
  email?: string;
  basicSalary: number;
}

export interface ApplyLeaveDto {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface ProcessPayrollDto {
  month: number;
  year: number;
}

@Injectable()
export class HrService {
  private readonly logger = new Logger(HrService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  // ----------------------------------------------------
  // OVERVIEW & HR DASHBOARD
  // ----------------------------------------------------

  @Cacheable({
    key: 'hr:overview:summary',
    ttl: TTL_PRESETS.SHORT,
    tags: ['hr'],
  })
  async getHrDashboard() {
    const [totalEmployees, activeEmployees, pendingLeaves, recentPayrolls] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.count({ where: { status: EmploymentStatus.ACTIVE } }),
      this.prisma.employeeLeave.count({ where: { status: LeaveStatus.PENDING } }),
      this.prisma.payroll.findMany({
        take: 5,
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: { employee: true },
      }),
    ]);

    return {
      totalEmployees,
      activeEmployees,
      onLeave: totalEmployees - activeEmployees,
      pendingLeaves,
      recentPayrolls,
    };
  }

  // ----------------------------------------------------
  // EMPLOYEES DIRECTORY
  // ----------------------------------------------------

  async getEmployees(query: { search?: string; departmentId?: string; status?: EmploymentStatus; page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.status) where.status = query.status;

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { employeeId: { contains: query.search, mode: 'insensitive' } },
        { designation: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        include: {
          department: true,
          user: { select: { email: true, phone: true, avatarUrl: true } },
          _count: { select: { leaves: true, payrolls: true } },
        },
        orderBy: { employeeId: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  async getEmployeeById(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        user: true,
        leaves: { orderBy: { startDate: 'desc' } },
        payrolls: { orderBy: [{ year: 'desc' }, { month: 'desc' }] },
      },
    });
    if (!employee) throw new NotFoundException('Employee record not found');
    return employee;
  }

  @CacheEvict({ tags: ['hr'] })
  async createEmployee(dto: CreateEmployeeDto, userId?: string) {
    let employeeId = dto.employeeId;
    if (!employeeId) {
      const count = await this.prisma.employee.count();
      employeeId = `EMP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    }

    const existing = await this.prisma.employee.findUnique({ where: { employeeId } });
    if (existing) throw new ConflictException(`Employee ID "${employeeId}" already exists`);

    const employee = await this.prisma.employee.create({
      data: {
        employeeId,
        userId: dto.userId,
        departmentId: dto.departmentId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        designation: dto.designation,
        qualification: dto.qualification,
        joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : new Date(),
        status: dto.status || EmploymentStatus.ACTIVE,
        phone: dto.phone,
        email: dto.email,
        basicSalary: dto.basicSalary,
      },
      include: { department: true },
    });

    await this.auditService.log({
      userId,
      action: 'EMPLOYEE_CREATE',
      entity: 'Employee',
      entityId: employee.id,
      newData: { employeeId, name: `${dto.firstName} ${dto.lastName || ''}`, designation: dto.designation },
    });

    return employee;
  }

  // ----------------------------------------------------
  // LEAVE WORKFLOW & APPROVALS
  // ----------------------------------------------------

  async getLeaves(query: { employeeId?: string; status?: LeaveStatus }) {
    return this.prisma.employeeLeave.findMany({
      where: {
        ...(query.employeeId ? { employeeId: query.employeeId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      include: { employee: { include: { department: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @CacheEvict({ tags: ['hr'] })
  async applyLeave(dto: ApplyLeaveDto, userId?: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id: dto.employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end < start) throw new BadRequestException('Leave end date cannot be before start date');

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await this.prisma.employeeLeave.create({
      data: {
        employeeId: dto.employeeId,
        leaveType: dto.leaveType,
        startDate: start,
        endDate: end,
        days: diffDays,
        reason: dto.reason,
        status: LeaveStatus.PENDING,
      },
      include: { employee: true },
    });

    await this.auditService.log({
      userId,
      action: 'LEAVE_APPLY',
      entity: 'EmployeeLeave',
      entityId: leave.id,
      newData: { employeeId: employee.employeeId, leaveType: dto.leaveType, days: diffDays },
    });

    return leave;
  }

  @CacheEvict({ tags: ['hr'] })
  async updateLeaveStatus(leaveId: string, status: LeaveStatus, approverUserId?: string) {
    const leave = await this.prisma.employeeLeave.findUnique({
      where: { id: leaveId },
      include: { employee: true },
    });
    if (!leave) throw new NotFoundException('Leave application not found');

    const updated = await this.prisma.employeeLeave.update({
      where: { id: leaveId },
      data: {
        status,
        approvedBy: approverUserId,
      },
      include: { employee: true },
    });

    await this.auditService.log({
      userId: approverUserId,
      action: 'LEAVE_DECISION',
      entity: 'EmployeeLeave',
      entityId: leaveId,
      oldData: { status: leave.status },
      newData: { status, approvedBy: approverUserId },
    });

    // Notify employee if user account exists
    if (leave.employee.userId) {
      await this.jobsService.dispatchNotification({
        userId: leave.employee.userId,
        title: `Leave Application ${status}`,
        message: `Your ${leave.leaveType} leave request for ${leave.days} day(s) starting ${leave.startDate.toLocaleDateString()} has been ${status.toLowerCase()}.`,
        type: 'GENERAL',
      });
    }

    return updated;
  }

  // ----------------------------------------------------
  // DETERMINISTIC PAYROLL ENGINE & AUDITABLE REVERSAL
  // ----------------------------------------------------

  async getPayrolls(query: { month?: number; year?: number; status?: PayrollStatus }) {
    return this.prisma.payroll.findMany({
      where: {
        ...(query.month ? { month: Number(query.month) } : {}),
        ...(query.year ? { year: Number(query.year) } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      include: { employee: { include: { department: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  /**
   * Deterministic payroll calculation formula:
   * Gross Salary = Basic Salary + Allowances (Medical 10%, House 20%, Utility 5%) + Bonuses
   * Deductions   = Unpaid Leave deduction + Income Tax
   * Net Salary   = Gross Salary - Deductions
   */
  @CacheEvict({ tags: ['hr'] })
  async generateMonthlyPayroll(dto: ProcessPayrollDto, userId?: string) {
    const activeEmployees = await this.prisma.employee.findMany({
      where: { status: EmploymentStatus.ACTIVE },
      include: {
        leaves: {
          where: {
            status: LeaveStatus.APPROVED,
            leaveType: LeaveType.UNPAID,
          },
        },
      },
    });

    if (activeEmployees.length === 0) {
      throw new BadRequestException('No active employees found for payroll calculation');
    }

    return this.txService.executeWithTransaction(async (tx) => {
      const generatedList = [];

      for (const emp of activeEmployees) {
        const basicSalary = Number(emp.basicSalary || 50000);

        // Standard institutional allowances: House Rent (20%), Medical (10%), Conveyance (5%)
        const houseRent = Math.round(basicSalary * 0.2);
        const medicalAllowance = Math.round(basicSalary * 0.1);
        const conveyance = Math.round(basicSalary * 0.05);
        const totalAllowances = houseRent + medicalAllowance + conveyance;

        // Bonuses
        const bonuses = 0;

        // Unpaid leave deductions
        const dailyRate = Math.round(basicSalary / 30);
        const unpaidDays = emp.leaves.reduce((sum, l) => sum + (l.days || 0), 0);
        const unpaidDeduction = unpaidDays * dailyRate;

        // Progressive tax estimation (e.g. 5% if gross > 100k)
        const grossSalary = basicSalary + totalAllowances + bonuses;
        const tax = grossSalary > 100000 ? Math.round(grossSalary * 0.05) : 0;
        const totalDeductions = unpaidDeduction + tax;
        const netSalary = grossSalary - totalDeductions;

        const calculationLog = {
          basicSalary,
          houseRent,
          medicalAllowance,
          conveyance,
          totalAllowances,
          bonuses,
          unpaidDays,
          unpaidDeduction,
          tax,
          grossSalary,
          netSalary,
        };

        // Check if payroll already exists for this period
        const existing = await tx.payroll.findUnique({
          where: {
            employeeId_month_year: {
              employeeId: emp.id,
              month: dto.month,
              year: dto.year,
            },
          },
        });

        // Invariant: Once APPROVED or PAID, do not silently overwrite
        if (existing && (existing.status === PayrollStatus.APPROVED || existing.status === PayrollStatus.PAID)) {
          continue; // Skip finalized records
        }

        const payroll = await tx.payroll.upsert({
          where: {
            employeeId_month_year: {
              employeeId: emp.id,
              month: dto.month,
              year: dto.year,
            },
          },
          update: {
            basicSalary,
            allowances: totalAllowances,
            bonuses,
            deductions: totalDeductions,
            tax,
            netSalary,
            status: PayrollStatus.CALCULATED,
            calculationLog,
            processedBy: userId,
          },
          create: {
            employeeId: emp.id,
            month: dto.month,
            year: dto.year,
            basicSalary,
            allowances: totalAllowances,
            bonuses,
            deductions: totalDeductions,
            tax,
            netSalary,
            status: PayrollStatus.CALCULATED,
            calculationLog,
            processedBy: userId,
          },
          include: { employee: true },
        });

        generatedList.push(payroll);
      }

      await this.auditService.log({
        userId,
        action: 'PAYROLL_CALCULATE',
        entity: 'Payroll',
        newData: { month: dto.month, year: dto.year, calculatedCount: generatedList.length },
      });

      return {
        month: dto.month,
        year: dto.year,
        processedCount: generatedList.length,
        payrolls: generatedList,
      };
    });
  }

  /**
   * Approve calculated payroll period
   */
  @CacheEvict({ tags: ['hr'] })
  async approvePayroll(payrollId: string, userId?: string) {
    const payroll = await this.prisma.payroll.findUnique({
      where: { id: payrollId },
      include: { employee: true },
    });
    if (!payroll) throw new NotFoundException('Payroll record not found');
    if (payroll.status !== PayrollStatus.CALCULATED) {
      throw new BadRequestException(`Cannot approve payroll with status "${payroll.status}"`);
    }

    const approved = await this.prisma.payroll.update({
      where: { id: payrollId },
      data: {
        status: PayrollStatus.APPROVED,
        approvedBy: userId,
      },
      include: { employee: true },
    });

    await this.auditService.log({
      userId,
      action: 'PAYROLL_APPROVE',
      entity: 'Payroll',
      entityId: payrollId,
      newData: { employee: payroll.employee.employeeId, netSalary: payroll.netSalary, approvedBy: userId },
    });

    return approved;
  }

  /**
   * Mark approved payroll as disbursed / PAID
   */
  @CacheEvict({ tags: ['hr'] })
  async markPayrollPaid(payrollId: string, userId?: string) {
    const payroll = await this.prisma.payroll.findUnique({ where: { id: payrollId } });
    if (!payroll) throw new NotFoundException('Payroll record not found');
    if (payroll.status !== PayrollStatus.APPROVED) {
      throw new BadRequestException('Payroll must be APPROVED prior to disbursement');
    }

    return this.prisma.payroll.update({
      where: { id: payrollId },
      data: {
        status: PayrollStatus.PAID,
        paidAt: new Date(),
      },
      include: { employee: true },
    });
  }

  /**
   * Critical invariant: Finalized payroll cannot be silently modified. Must use audited reversal.
   */
  @CacheEvict({ tags: ['hr'] })
  async reversePayroll(payrollId: string, reason: string, userId?: string) {
    if (!reason) throw new BadRequestException('A valid reason is required to reverse finalized payroll');

    const payroll = await this.prisma.payroll.findUnique({
      where: { id: payrollId },
      include: { employee: true },
    });
    if (!payroll) throw new NotFoundException('Payroll record not found');
    if (payroll.status === PayrollStatus.REVERSED) {
      throw new BadRequestException('Payroll is already marked as REVERSED');
    }

    const reversed = await this.prisma.payroll.update({
      where: { id: payrollId },
      data: {
        status: PayrollStatus.REVERSED,
        reversedAt: new Date(),
        reversalReason: reason,
      },
      include: { employee: true },
    });

    await this.auditService.log({
      userId,
      action: 'PAYROLL_REVERSE',
      entity: 'Payroll',
      entityId: payrollId,
      oldData: { status: payroll.status, netSalary: payroll.netSalary },
      newData: { status: PayrollStatus.REVERSED, reason, reversedAt: new Date() },
    });

    return reversed;
  }
}

