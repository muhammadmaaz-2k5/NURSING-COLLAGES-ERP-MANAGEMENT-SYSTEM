import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  roleNames?: string[];
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  status?: UserStatus;
  roleNames?: string[];
}

export interface QueryUsersDto {
  search?: string;
  status?: UserStatus;
  role?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(query: QueryUsersDto): Promise<PaginatedResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.role) {
      where.roles = {
        some: {
          role: {
            name: query.role.toUpperCase(),
          },
        },
      };
    }

    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatarUrl: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          roles: {
            include: {
              role: {
                select: { id: true, name: true, description: true },
              },
            },
          },
          student: { select: { id: true, studentId: true, program: { select: { name: true } } } },
          faculty: { select: { id: true, employeeId: true, designation: true } },
          employee: { select: { id: true, employeeId: true, designation: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const formatted = users.map((u) => ({
      ...u,
      roles: u.roles.map((r) => r.role.name),
    }));

    return createPaginatedResult(formatted, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
        student: { include: { program: true } },
        faculty: { include: { department: true } },
        employee: { include: { department: true } },
      },
    });

    if (!user) throw new NotFoundException(`User with ID "${id}" not found`);
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async create(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        status: UserStatus.ACTIVE,
      },
    });

    // Assign initial roles
    if (data.roleNames && data.roleNames.length > 0) {
      for (const roleName of data.roleNames) {
        const role = await this.prisma.role.findUnique({ where: { name: roleName.toUpperCase() } });
        if (role) {
          await this.prisma.userRole.create({
            data: {
              userId: user.id,
              roleId: role.id,
            },
          });
        }
      }
    }

    return this.findOne(user.id);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID "${id}" not found`);

    await this.prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        status: data.status,
      },
    });

    // Update roles if provided
    if (data.roleNames) {
      await this.prisma.userRole.deleteMany({ where: { userId: id } });
      for (const roleName of data.roleNames) {
        const role = await this.prisma.role.findUnique({ where: { name: roleName.toUpperCase() } });
        if (role) {
          await this.prisma.userRole.create({
            data: {
              userId: id,
              roleId: role.id,
            },
          });
        }
      }
      await this.cacheService.evictByTag(`user:${id}`);
    }

    return this.findOne(id);
  }

  async setStatus(id: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID "${id}" not found`);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status },
    });

    if (status !== UserStatus.ACTIVE) {
      // Invalidate active sessions immediately
      await this.cacheService.evictPattern(`refresh_token:${id}:*`);
    }

    return { id: updated.id, email: updated.email, status: updated.status };
  }
}
