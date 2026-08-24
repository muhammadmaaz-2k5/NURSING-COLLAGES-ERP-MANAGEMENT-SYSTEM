import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmploymentStatus, LeaveStatus } from '@prisma/client';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class HrService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'hr:employees:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['hr'],
  })
  async getEmployees(departmentId?: string, status?: EmploymentStatus) {
    return this.prisma.employee.findMany({
      where: {
        ...(departmentId ? { departmentId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        department: true,
        user: { select: { email: true, phone: true, avatarUrl: true } },
      },
      orderBy: { employeeId: 'asc' },
    });
  }

  async getLeaves(employeeId?: string, status?: LeaveStatus) {
    return this.prisma.employeeLeave.findMany({
      where: {
        ...(employeeId ? { employeeId } : {}),
        ...(status ? { status } : {}),
      },
      include: { employee: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async getPayrolls(month?: number, year?: number) {
    return this.prisma.payroll.findMany({
      where: {
        ...(month ? { month } : {}),
        ...(year ? { year } : {}),
      },
      include: { employee: { include: { department: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }
}
