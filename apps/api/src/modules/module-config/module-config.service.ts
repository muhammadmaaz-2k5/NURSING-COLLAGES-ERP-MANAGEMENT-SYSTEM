import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ToggleModuleDto } from './dto/toggle-module.dto';
import { ModuleType } from '@prisma/client';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class ModuleConfigService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'college:modules:list',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['modules'],
  })
  async getModules() {
    const modules = await this.prisma.collegeModule.findMany();
    const allModules = Object.values(ModuleType);
    const existingMap = new Map(modules.map((m) => [m.module, m]));

    return allModules.map((mod) => {
      const existing = existingMap.get(mod);
      return {
        module: mod,
        enabled: existing ? existing.enabled : false,
        settings: existing?.settings || null,
        updatedAt: existing?.updatedAt || null,
      };
    });
  }

  @CacheEvict({
    tags: ['modules'],
    keys: ['college:modules:list', 'college:profile'],
  })
  async toggleModule(dto: ToggleModuleDto) {
    let college = await this.prisma.college.findFirst();
    if (!college) {
      college = await this.prisma.college.create({
        data: {
          name: 'College Instance',
          code: 'COL-01',
          slug: 'college-instance',
        },
      });
    }

    return this.prisma.collegeModule.upsert({
      where: {
        module: dto.module,
      },
      update: {
        enabled: dto.enabled,
        settings: dto.settings,
      },
      create: {
        collegeId: college.id,
        module: dto.module,
        enabled: dto.enabled,
        settings: dto.settings,
      },
    });
  }
}
