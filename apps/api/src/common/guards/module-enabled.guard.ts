import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ModuleType } from '@prisma/client';
import { REQUIRE_MODULE_KEY } from './require-module.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache';

@Injectable()
export class ModuleEnabledGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.getAllAndOverride<ModuleType>(
      REQUIRE_MODULE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredModule) {
      return true; // No module restriction on this route
    }

    // Check module state from cache or database
    const cacheKey = `module:status:${requiredModule}`;
    const isEnabled = await this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const mod = await this.prisma.collegeModule.findUnique({
          where: { module: requiredModule },
        });
        return mod ? mod.enabled : false;
      },
      300,
      ['modules'],
    );

    if (!isEnabled) {
      throw new ForbiddenException(
        `Feature Unavailable: The "${requiredModule}" module is not enabled for this college deployment instance.`,
      );
    }

    return true;
  }
}
