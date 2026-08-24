import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SYSTEM_PERMISSIONS } from './permission-list';
import { ModuleType } from '@prisma/client';

@Injectable()
export class RbacBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RbacBootstrapService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    try {
      await this.seedPermissions();
      await this.seedRolesAndPermissions();
    } catch (err: any) {
      this.logger.warn(`RBAC bootstrap check deferred: ${err?.message}`);
    }
  }

  private async seedPermissions() {
    for (const p of SYSTEM_PERMISSIONS) {
      await this.prisma.permission.upsert({
        where: {
          module_action_resource: {
            module: p.module,
            action: p.action,
            resource: p.resource,
          },
        },
        update: { description: p.description },
        create: {
          module: p.module,
          action: p.action,
          resource: p.resource,
          description: p.description,
        },
      });
    }
    this.logger.log(`🛡️ Seeded ${SYSTEM_PERMISSIONS.length} granular system permissions`);
  }

  private async seedRolesAndPermissions() {
    const roles = [
      { name: 'SUPER_ADMIN', description: 'Full system super administrator', isSystem: true },
      { name: 'ADMIN', description: 'Campus & College administrative officer', isSystem: true },
      { name: 'DEAN', description: 'Academic dean & medical director', isSystem: true },
      { name: 'HOD', description: 'Head of academic/clinical department', isSystem: true },
      { name: 'FACULTY', description: 'Professor, lecturer, or clinical instructor', isSystem: true },
      { name: 'STUDENT', description: 'Enrolled student (BSN, Post-RN, etc)', isSystem: true },
      { name: 'ACCOUNTANT', description: 'Finance & fee collection officer', isSystem: true },
      { name: 'LIBRARIAN', description: 'Library manager & cataloguer', isSystem: true },
      { name: 'DOCTOR', description: 'Hospital OPD/IPD consultant physician', isSystem: true },
      { name: 'NURSE', description: 'Staff nurse & clinical trainer', isSystem: true },
    ];

    const createdRoles: Record<string, string> = {};
    for (const r of roles) {
      const role = await this.prisma.role.upsert({
        where: { name: r.name },
        update: { description: r.description },
        create: r,
      });
      createdRoles[r.name] = role.id;
    }

    const allPerms = await this.prisma.permission.findMany();

    // Map permissions for FACULTY
    const facultyModules: ModuleType[] = [
      ModuleType.ACADEMIC,
      ModuleType.ATTENDANCE,
      ModuleType.EXAMINATIONS,
      ModuleType.RESULTS,
      ModuleType.CLINICAL_TRAINING,
    ];
    const facultyPermCodes = allPerms.filter((p) => facultyModules.includes(p.module));
    for (const p of facultyPermCodes) {
      await this.prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: createdRoles['FACULTY'],
            permissionId: p.id,
          },
        },
        update: {},
        create: {
          roleId: createdRoles['FACULTY'],
          permissionId: p.id,
        },
      });
    }

    // Map permissions for ACCOUNTANT
    const accountantModules: ModuleType[] = [
      ModuleType.FEES,
      ModuleType.FINANCE,
      ModuleType.PAYROLL,
    ];
    const accountantPermCodes = allPerms.filter((p) => accountantModules.includes(p.module));
    for (const p of accountantPermCodes) {
      await this.prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: createdRoles['ACCOUNTANT'],
            permissionId: p.id,
          },
        },
        update: {},
        create: {
          roleId: createdRoles['ACCOUNTANT'],
          permissionId: p.id,
        },
      });
    }

    // Assign SUPER_ADMIN role to default admin user if present
    const adminUser = await this.prisma.user.findUnique({ where: { email: 'admin@nmc.edu.pk' } });
    if (adminUser && createdRoles['SUPER_ADMIN']) {
      await this.prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: adminUser.id,
            roleId: createdRoles['SUPER_ADMIN'],
          },
        },
        update: {},
        create: {
          userId: adminUser.id,
          roleId: createdRoles['SUPER_ADMIN'],
        },
      });
    }

    this.logger.log('🛡️ Standard system roles and permission matrices initialized');
  }
}
