import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IssueStatus, RoomAllocationStatus } from '@prisma/client';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class FacilitiesService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'facilities:hostels:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['facilities', 'hostels'],
  })
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
    });
  }

  @Cacheable({
    key: 'facilities:library:books:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['facilities', 'library'],
  })
  async getLibraryBooks(search?: string) {
    return this.prisma.libraryBook.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { author: { contains: search, mode: 'insensitive' } },
              { isbn: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { library: true },
    });
  }

  async getLibraryIssues(studentId?: string, status?: IssueStatus) {
    return this.prisma.libraryIssue.findMany({
      where: {
        ...(studentId ? { studentId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        book: true,
        student: { include: { user: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
  }

  @Cacheable({
    key: 'facilities:transport:routes:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['facilities', 'transport'],
  })
  async getTransportRoutes() {
    return this.prisma.transportRoute.findMany({
      include: {
        vehicle: true,
        stops: {
          orderBy: { sequence: 'asc' },
          include: { assignments: true },
        },
      },
    });
  }
}
