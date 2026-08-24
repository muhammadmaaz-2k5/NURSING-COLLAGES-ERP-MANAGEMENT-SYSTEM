import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

export interface UpdateCollegeDto {
  name?: string;
  code?: string;
  slug?: string;
  logoUrl?: string;
  faviconUrl?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
}

export interface UpdateCollegeSettingsDto {
  timezone?: string;
  currency?: string;
  gradingSystem?: Record<string, any>;
  attendanceSettings?: Record<string, any>;
  admissionSettings?: Record<string, any>;
  feeSettings?: Record<string, any>;
  websiteSettings?: Record<string, any>;
}

@Injectable()
export class CollegeService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'college:profile:full',
    ttl: TTL_PRESETS.LONG,
    tags: ['college'],
  })
  async getProfile() {
    const college = await this.prisma.college.findFirst({
      include: {
        settings: true,
        modules: {
          orderBy: { module: 'asc' },
        },
      },
    });

    if (!college) {
      throw new NotFoundException('College profile not initialized for this instance.');
    }

    return college;
  }

  @CacheEvict({
    tags: ['college'],
    keys: ['college:profile:full', 'college:profile'],
  })
  async updateProfile(data: UpdateCollegeDto) {
    const college = await this.prisma.college.findFirst();
    if (!college) {
      throw new NotFoundException('College profile not initialized.');
    }

    return this.prisma.college.update({
      where: { id: college.id },
      data,
      include: { settings: true },
    });
  }

  @CacheEvict({
    tags: ['college'],
    keys: ['college:profile:full', 'college:profile'],
  })
  async updateSettings(data: UpdateCollegeSettingsDto) {
    const college = await this.prisma.college.findFirst();
    if (!college) {
      throw new NotFoundException('College profile not initialized.');
    }

    return this.prisma.collegeSettings.upsert({
      where: { collegeId: college.id },
      update: data,
      create: {
        collegeId: college.id,
        timezone: data.timezone || 'Asia/Karachi',
        currency: data.currency || 'PKR',
        gradingSystem: data.gradingSystem,
        attendanceSettings: data.attendanceSettings,
        admissionSettings: data.admissionSettings,
        feeSettings: data.feeSettings,
        websiteSettings: data.websiteSettings,
      },
    });
  }
}
