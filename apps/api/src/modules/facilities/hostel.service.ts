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
import { Gender, HostelRoomType, HostelStatus, RoomAllocationStatus } from '@prisma/client';

export interface CreateHostelDto {
  name: string;
  code: string;
  gender?: Gender;
  address?: string;
}

export interface CreateHostelRoomDto {
  hostelId: string;
  roomNumber: string;
  floor?: string;
  type?: HostelRoomType;
  capacity?: number;
}

export interface CreateHostelBedDto {
  roomId: string;
  bedNumber: string;
}

export interface AllocateHostelBedDto {
  studentId: string;
  bedId: string;
  startDate: string;
  endDate?: string;
  remarks?: string;
}

@Injectable()
export class HostelService {
  private readonly logger = new Logger(HostelService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  // ----------------------------------------------------
  // OCCUPANCY DASHBOARD & STATS
  // ----------------------------------------------------

  @Cacheable({
    key: 'hostel:occupancy:summary',
    ttl: TTL_PRESETS.SHORT,
    tags: ['hostel'],
  })
  async getHostelDashboard() {
    const [hostels, totalBeds, activeAllocations] = await Promise.all([
      this.prisma.hostel.findMany({
        include: {
          rooms: {
            include: {
              beds: {
                include: {
                  allocations: {
                    where: { status: RoomAllocationStatus.ACTIVE },
                    include: {
                      student: {
                        include: {
                          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
                          program: { select: { name: true, code: true } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.hostelBed.count({ where: { isActive: true } }),
      this.prisma.hostelAllocation.count({ where: { status: RoomAllocationStatus.ACTIVE } }),
    ]);

    const occupiedBeds = activeAllocations;
    const availableBeds = Math.max(0, totalBeds - occupiedBeds);
    const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : '0';

    return {
      totalHostels: hostels.length,
      totalBeds,
      occupiedBeds,
      availableBeds,
      occupancyRate: `${occupancyRate}%`,
      hostels,
    };
  }

  // ----------------------------------------------------
  // HOSTELS, ROOMS & BEDS
  // ----------------------------------------------------

  async getHostels() {
    return this.prisma.hostel.findMany({
      include: {
        rooms: {
          include: {
            beds: {
              include: {
                allocations: {
                  where: { status: RoomAllocationStatus.ACTIVE },
                  include: { student: { include: { user: true } } },
                },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({ tags: ['hostel'] })
  async createHostel(dto: CreateHostelDto, userId?: string) {
    const existing = await this.prisma.hostel.findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Hostel with code "${dto.code}" already exists`);

    return this.prisma.hostel.create({
      data: {
        name: dto.name,
        code: dto.code,
        gender: dto.gender,
        address: dto.address,
        status: HostelStatus.ACTIVE,
      },
    });
  }

  @CacheEvict({ tags: ['hostel'] })
  async createRoom(dto: CreateHostelRoomDto, userId?: string) {
    const hostel = await this.prisma.hostel.findUnique({ where: { id: dto.hostelId } });
    if (!hostel) throw new NotFoundException('Hostel not found');

    const capacity = dto.capacity || 2;
    return this.txService.executeWithTransaction(async (tx) => {
      const room = await tx.hostelRoom.create({
        data: {
          hostelId: dto.hostelId,
          roomNumber: dto.roomNumber,
          floor: dto.floor,
          type: dto.type || HostelRoomType.DOUBLE,
          capacity,
        },
      });

      // Auto-create beds for room capacity
      for (let i = 1; i <= capacity; i++) {
        await tx.hostelBed.create({
          data: {
            roomId: room.id,
            bedNumber: `BED-${dto.roomNumber}-${i}`,
            isActive: true,
          },
        });
      }

      return room;
    });
  }

  @CacheEvict({ tags: ['hostel'] })
  async createBed(dto: CreateHostelBedDto) {
    const room = await this.prisma.hostelRoom.findUnique({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException('Room not found');

    return this.prisma.hostelBed.create({
      data: {
        roomId: dto.roomId,
        bedNumber: dto.bedNumber,
        isActive: true,
      },
    });
  }

  // ----------------------------------------------------
  // ALLOCATION LIFECYCLE (CONCURRENCY & SINGLE-ALLOCATION INVARIANT)
  // ----------------------------------------------------

  /**
   * Critical invariant: A bed cannot have two active allocations at the same time.
   */
  @CacheEvict({ tags: ['hostel'] })
  async allocateBed(dto: AllocateHostelBedDto, userId?: string) {
    const [student, bed] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: dto.studentId }, include: { user: true } }),
      this.prisma.hostelBed.findUnique({
        where: { id: dto.bedId },
        include: { room: { include: { hostel: true } } },
      }),
    ]);

    if (!student) throw new NotFoundException('Student record not found');
    if (!bed) throw new NotFoundException('Hostel bed not found');
    if (!bed.isActive) throw new BadRequestException('Selected bed is currently under maintenance or inactive');

    // Gender check
    if (bed.room.hostel.gender && student.gender && bed.room.hostel.gender !== student.gender) {
      throw new BadRequestException(
        `Hostel is designated for ${bed.room.hostel.gender} students only`,
      );
    }

    return this.txService.executeWithTransaction(async (tx) => {
      // 1. Check if student already has an active allocation
      const existingStudentAllocation = await tx.hostelAllocation.findFirst({
        where: { studentId: dto.studentId, status: RoomAllocationStatus.ACTIVE },
      });
      if (existingStudentAllocation) {
        throw new ConflictException('Student already has an active hostel bed allocation');
      }

      // 2. Check if bed currently has an active allocation
      const existingBedOccupant = await tx.hostelAllocation.findFirst({
        where: { bedId: dto.bedId, status: RoomAllocationStatus.ACTIVE },
      });
      if (existingBedOccupant) {
        throw new ConflictException(
          `Bed ${bed.bedNumber} in ${bed.room.hostel.name} Room ${bed.room.roomNumber} is already occupied`,
        );
      }

      // 3. Create allocation
      const allocation = await tx.hostelAllocation.create({
        data: {
          studentId: dto.studentId,
          bedId: dto.bedId,
          startDate: new Date(dto.startDate),
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
          status: RoomAllocationStatus.ACTIVE,
          remarks: dto.remarks,
        },
        include: {
          student: { include: { user: true } },
          bed: { include: { room: { include: { hostel: true } } } },
        },
      });

      await this.auditService.log({
        userId,
        action: 'HOSTEL_ALLOCATE',
        entity: 'HostelAllocation',
        entityId: allocation.id,
        newData: {
          studentId: dto.studentId,
          studentName: `${student.user.firstName} ${student.user.lastName || ''}`,
          bedNumber: bed.bedNumber,
          hostel: bed.room.hostel.name,
        },
      });

      // Notify student via BullMQ
      await this.jobsService.dispatchNotification({
        userId: student.userId,
        title: 'Hostel Bed Allocated',
        message: `You have been allocated Bed ${bed.bedNumber} in ${bed.room.hostel.name} (Room ${bed.room.roomNumber}).`,
        type: 'GENERAL',
      });

      return allocation;
    });
  }

  /**
   * Transfer student to another bed
   */
  @CacheEvict({ tags: ['hostel'] })
  async transferBed(allocationId: string, targetBedId: string, userId?: string) {
    return this.txService.executeWithTransaction(async (tx) => {
      const allocation = await tx.hostelAllocation.findUnique({
        where: { id: allocationId },
        include: { bed: true, student: { include: { user: true } } },
      });
      if (!allocation || allocation.status !== RoomAllocationStatus.ACTIVE) {
        throw new NotFoundException('Active hostel allocation not found');
      }

      const targetBed = await tx.hostelBed.findUnique({
        where: { id: targetBedId },
        include: { room: { include: { hostel: true } } },
      });
      if (!targetBed || !targetBed.isActive) throw new NotFoundException('Target bed is not available');

      // Check target bed active occupancy
      const targetOccupant = await tx.hostelAllocation.findFirst({
        where: { bedId: targetBedId, status: RoomAllocationStatus.ACTIVE },
      });
      if (targetOccupant) {
        throw new ConflictException(`Target bed ${targetBed.bedNumber} is already occupied`);
      }

      // Close old allocation
      await tx.hostelAllocation.update({
        where: { id: allocationId },
        data: { status: RoomAllocationStatus.COMPLETED, endDate: new Date() },
      });

      // Create new allocation for target bed
      const newAllocation = await tx.hostelAllocation.create({
        data: {
          studentId: allocation.studentId,
          bedId: targetBedId,
          startDate: new Date(),
          status: RoomAllocationStatus.ACTIVE,
          remarks: `Transferred from Bed ${allocation.bed.bedNumber}`,
        },
        include: {
          student: { include: { user: true } },
          bed: { include: { room: { include: { hostel: true } } } },
        },
      });

      await this.auditService.log({
        userId,
        action: 'HOSTEL_TRANSFER',
        entity: 'HostelAllocation',
        entityId: newAllocation.id,
        oldData: { bedId: allocation.bedId, bedNumber: allocation.bed.bedNumber },
        newData: { bedId: targetBedId, bedNumber: targetBed.bedNumber },
      });

      return newAllocation;
    });
  }

  /**
   * Checkout student and release bed
   */
  @CacheEvict({ tags: ['hostel'] })
  async checkOut(allocationId: string, remarks?: string, userId?: string) {
    return this.txService.executeWithTransaction(async (tx) => {
      const allocation = await tx.hostelAllocation.findUnique({
        where: { id: allocationId },
        include: { bed: true, student: { include: { user: true } } },
      });
      if (!allocation || allocation.status !== RoomAllocationStatus.ACTIVE) {
        throw new NotFoundException('Active allocation not found');
      }

      const updated = await tx.hostelAllocation.update({
        where: { id: allocationId },
        data: {
          status: RoomAllocationStatus.COMPLETED,
          endDate: new Date(),
          remarks: remarks || allocation.remarks,
        },
        include: { bed: true, student: { include: { user: true } } },
      });

      await this.auditService.log({
        userId,
        action: 'HOSTEL_CHECKOUT',
        entity: 'HostelAllocation',
        entityId: allocationId,
        newData: { studentName: `${allocation.student.user.firstName}`, checkoutDate: new Date() },
      });

      return updated;
    });
  }
}
