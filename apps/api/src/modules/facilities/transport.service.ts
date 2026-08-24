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
import { VehicleStatus } from '@prisma/client';

export interface CreateVehicleDto {
  registrationNo: string;
  name?: string;
  type?: string;
  capacity?: number;
  driverName?: string;
  driverPhone?: string;
}

export interface CreateRouteDto {
  vehicleId: string;
  name: string;
  startPoint?: string;
  endPoint?: string;
}

export interface CreateStopDto {
  routeId: string;
  name: string;
  sequence: number;
  pickupTime?: string;
}

export interface AssignTransportDto {
  studentId: string;
  vehicleId: string;
  stopId?: string;
  startDate: string;
  endDate?: string;
}

@Injectable()
export class TransportService {
  private readonly logger = new Logger(TransportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  // ----------------------------------------------------
  // FLEET DASHBOARD & STATS
  // ----------------------------------------------------

  @Cacheable({
    key: 'transport:overview:metrics',
    ttl: TTL_PRESETS.SHORT,
    tags: ['transport'],
  })
  async getTransportDashboard() {
    const [vehicles, routes, totalAssigned] = await Promise.all([
      this.prisma.vehicle.findMany({
        include: {
          routes: { include: { stops: true } },
          assignments: {
            where: { status: 'ACTIVE' },
            include: { student: { include: { user: true } }, stop: true },
          },
        },
      }),
      this.prisma.transportRoute.count(),
      this.prisma.transportAssignment.count({ where: { status: 'ACTIVE' } }),
    ]);

    const activeVehicles = vehicles.filter((v) => v.status === VehicleStatus.ACTIVE).length;
    const totalCapacity = vehicles.reduce((sum, v) => sum + (v.capacity || 0), 0);
    const utilizationRate = totalCapacity > 0 ? ((totalAssigned / totalCapacity) * 100).toFixed(1) : '0';

    return {
      totalVehicles: vehicles.length,
      activeVehicles,
      totalRoutes: routes,
      totalCapacity,
      activePasses: totalAssigned,
      fleetUtilization: `${utilizationRate}%`,
      vehicles,
    };
  }

  // ----------------------------------------------------
  // VEHICLES & FLEET
  // ----------------------------------------------------

  async getVehicles() {
    return this.prisma.vehicle.findMany({
      include: {
        routes: { include: { stops: true } },
        assignments: { where: { status: 'ACTIVE' } },
      },
      orderBy: { registrationNo: 'asc' },
    });
  }

  @CacheEvict({ tags: ['transport'] })
  async createVehicle(dto: CreateVehicleDto, userId?: string) {
    const existing = await this.prisma.vehicle.findUnique({ where: { registrationNo: dto.registrationNo } });
    if (existing) throw new ConflictException(`Vehicle "${dto.registrationNo}" already registered`);

    const vehicle = await this.prisma.vehicle.create({
      data: {
        registrationNo: dto.registrationNo,
        name: dto.name,
        type: dto.type || 'Coaster Bus',
        capacity: dto.capacity || 30,
        driverName: dto.driverName,
        driverPhone: dto.driverPhone,
        status: VehicleStatus.ACTIVE,
      },
    });

    await this.auditService.log({
      userId,
      action: 'VEHICLE_CREATE',
      entity: 'Vehicle',
      entityId: vehicle.id,
      newData: { regNo: dto.registrationNo, capacity: dto.capacity },
    });

    return vehicle;
  }

  // ----------------------------------------------------
  // ROUTES & STOPS
  // ----------------------------------------------------

  async getRoutes() {
    return this.prisma.transportRoute.findMany({
      include: {
        vehicle: true,
        stops: { orderBy: { sequence: 'asc' }, include: { assignments: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({ tags: ['transport'] })
  async createRoute(dto: CreateRouteDto) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: dto.vehicleId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    return this.prisma.transportRoute.create({
      data: {
        vehicleId: dto.vehicleId,
        name: dto.name,
        startPoint: dto.startPoint,
        endPoint: dto.endPoint,
      },
      include: { vehicle: true },
    });
  }

  @CacheEvict({ tags: ['transport'] })
  async createStop(dto: CreateStopDto) {
    const route = await this.prisma.transportRoute.findUnique({ where: { id: dto.routeId } });
    if (!route) throw new NotFoundException('Route not found');

    return this.prisma.transportStop.create({
      data: {
        routeId: dto.routeId,
        name: dto.name,
        sequence: dto.sequence,
        pickupTime: dto.pickupTime,
      },
    });
  }

  // ----------------------------------------------------
  // PASSENGER ASSIGNMENTS (CAPACITY VALIDATION)
  // ----------------------------------------------------

  /**
   * Critical invariant: Do not exceed vehicle seating capacity and do not assign to inactive vehicles.
   */
  @CacheEvict({ tags: ['transport'] })
  async assignTransport(dto: AssignTransportDto, userId?: string) {
    const [student, vehicle] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: dto.studentId }, include: { user: true } }),
      this.prisma.vehicle.findUnique({ where: { id: dto.vehicleId } }),
    ]);

    if (!student) throw new NotFoundException('Student record not found');
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.status !== VehicleStatus.ACTIVE) {
      throw new BadRequestException('Cannot assign student to an inactive or maintenance-bound vehicle');
    }

    return this.txService.executeWithTransaction(async (tx) => {
      // 1. Check if student already has active transport assignment
      const existingAssignment = await tx.transportAssignment.findFirst({
        where: { studentId: dto.studentId, status: 'ACTIVE' },
      });
      if (existingAssignment) {
        throw new ConflictException('Student already holds an active transport route assignment');
      }

      // 2. Validate current vehicle capacity
      const currentActiveCount = await tx.transportAssignment.count({
        where: { vehicleId: dto.vehicleId, status: 'ACTIVE' },
      });
      if (currentActiveCount >= (vehicle.capacity || 30)) {
        throw new ConflictException(
          `Vehicle ${vehicle.registrationNo} has reached full seating capacity (${vehicle.capacity}/${vehicle.capacity})`,
        );
      }

      // 3. Create assignment
      const assignment = await tx.transportAssignment.create({
        data: {
          studentId: dto.studentId,
          vehicleId: dto.vehicleId,
          stopId: dto.stopId,
          startDate: new Date(dto.startDate),
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
          status: 'ACTIVE',
        },
        include: {
          student: { include: { user: true } },
          vehicle: true,
          stop: true,
        },
      });

      await this.auditService.log({
        userId,
        action: 'TRANSPORT_ASSIGN',
        entity: 'TransportAssignment',
        entityId: assignment.id,
        newData: {
          studentName: `${student.user.firstName} ${student.user.lastName || ''}`,
          vehicle: vehicle.registrationNo,
          stop: assignment.stop?.name,
        },
      });

      // Notify student
      await this.jobsService.dispatchNotification({
        userId: student.userId,
        title: 'Transport Pass Assigned',
        message: `Bus assignment confirmed for Vehicle ${vehicle.registrationNo}. Pickup point: ${assignment.stop?.name || 'Main Route'}.`,
        type: 'GENERAL',
      });

      return assignment;
    });
  }

  @CacheEvict({ tags: ['transport'] })
  async cancelAssignment(id: string, userId?: string) {
    const assignment = await this.prisma.transportAssignment.findUnique({
      where: { id },
      include: { student: { include: { user: true } }, vehicle: true },
    });
    if (!assignment) throw new NotFoundException('Assignment record not found');

    const updated = await this.prisma.transportAssignment.update({
      where: { id },
      data: { status: 'CANCELLED', endDate: new Date() },
    });

    await this.auditService.log({
      userId,
      action: 'TRANSPORT_CANCEL',
      entity: 'TransportAssignment',
      entityId: id,
      newData: { student: assignment.student.user.firstName, vehicle: assignment.vehicle.registrationNo },
    });

    return updated;
  }
}
