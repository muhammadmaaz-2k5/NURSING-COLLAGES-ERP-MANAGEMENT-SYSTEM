import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ModuleType } from '@prisma/client';

@Injectable()
export class InstanceBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(InstanceBootstrapService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.ensureCollegeInstance();
    } catch (err: any) {
      this.logger.warn(`Instance bootstrap check deferred: ${err?.message}`);
    }
  }

  private async ensureCollegeInstance() {
    const code = this.config.get<string>('COLLEGE_CODE', 'NMC-01');
    const name = this.config.get<string>('COLLEGE_NAME', 'National Medical & Healthcare College');
    const slug = code.toLowerCase().replace(/[^a-z0-9]/g, '-');

    let college = await this.prisma.college.findFirst();
    if (!college) {
      this.logger.log(`Initializing college profile for instance: ${name} (${code})`);
      college = await this.prisma.college.create({
        data: {
          name,
          code,
          slug,
          country: 'Pakistan',
          settings: {
            create: {
              timezone: 'Asia/Karachi',
              currency: 'PKR',
            },
          },
        },
      });
    }

    // Ensure all ModuleType enums exist in CollegeModule table
    const allModules = Object.values(ModuleType);
    for (const mod of allModules) {
      await this.prisma.collegeModule.upsert({
        where: { module: mod },
        update: {},
        create: {
          collegeId: college.id,
          module: mod,
          enabled: mod !== ModuleType.TRANSPORT, // transport off by default
        },
      });
    }

    this.logger.log(`🏛️ College Instance Ready: "${college.name}" [Code: ${college.code}]`);
  }
}
