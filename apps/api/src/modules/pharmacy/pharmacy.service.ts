import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class PharmacyService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'pharmacy:medicines:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['pharmacy'],
  })
  async getMedicines(search?: string) {
    return this.prisma.medicine.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { genericName: { contains: search, mode: 'insensitive' } },
              { category: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { pharmacy: true },
      orderBy: { name: 'asc' },
    });
  }

  @CacheEvict({
    tags: ['pharmacy'],
    keys: ['pharmacy:medicines:all'],
  })
  async addMedicine(data: {
    name: string;
    genericName?: string;
    category?: string;
    manufacturer?: string;
    unit?: string;
    quantity: number;
    reorderLevel?: number;
    expiryDate?: Date;
  }) {
    let pharmacy = await this.prisma.pharmacy.findFirst();
    if (!pharmacy) {
      pharmacy = await this.prisma.pharmacy.create({
        data: { name: 'Main Campus Pharmacy', location: 'Ground Floor Block B' },
      });
    }

    return this.prisma.medicine.create({
      data: {
        pharmacyId: pharmacy.id,
        ...data,
      },
    });
  }
}
