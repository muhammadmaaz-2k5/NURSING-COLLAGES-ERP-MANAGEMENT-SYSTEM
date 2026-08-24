import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { ModuleType } from '@prisma/client';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class CollegeService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'college:profile',
    ttl: TTL_PRESETS.LONG,
    tags: ['college'],
  })
  async getProfile() {
    const college = await this.prisma.college.findFirst({
      include: {
        settings: true,
        modules: true,
      },
    });

    if (!college) {
      throw new NotFoundException('College profile not initialized for this instance.');
    }

    return college;
  }

  async findAll() {
    return this.prisma.college.findMany({
      include: {
        settings: true,
        modules: {
          where: { enabled: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const college = await this.prisma.college.findFirst({
      where: {
        OR: [{ id }, { code: id }, { slug: id }],
      },
      include: {
        settings: true,
        modules: true,
      },
    });

    if (!college) {
      throw new NotFoundException(`College with identifier "${id}" not found`);
    }

    return college;
  }

  @CacheEvict({
    tags: ['college'],
    keys: ['college:profile'],
  })
  async create(dto: CreateCollegeDto) {
    const college = await this.prisma.college.create({
      data: {
        ...dto,
        settings: {
          create: {
            timezone: 'Asia/Karachi',
            currency: 'PKR',
          },
        },
      },
    });

    // Initialize standard modules
    const defaultModules: ModuleType[] = [
      ModuleType.ACADEMIC,
      ModuleType.STUDENTS,
      ModuleType.ADMISSIONS,
      ModuleType.FACULTY,
      ModuleType.ATTENDANCE,
      ModuleType.EXAMINATIONS,
      ModuleType.RESULTS,
      ModuleType.FEES,
    ];

    await this.prisma.collegeModule.createMany({
      data: defaultModules.map((m) => ({
        collegeId: college.id,
        module: m,
        enabled: true,
      })),
      skipDuplicates: true,
    });

    return this.findOne(college.id);
  }
}
