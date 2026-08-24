import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CacheService } from '../../../common/cache';
import { SYSTEM_PERMISSIONS } from './permission-list';

@Injectable()
export class RbacService {
  private readonly logger = new Logger(RbacService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Resolve and return all deduplicated permissions for a user across all their roles.
   * Cached with high performance in Redis / In-Memory.
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const cacheKey = `user:permissions:${userId}`;

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const userWithRoles = await this.prisma.user.findUnique({
          where: { id: userId },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!userWithRoles) return [];

        const permissions = new Set<string>();

        for (const userRole of userWithRoles.roles) {
          const role = userRole.role;
          if (role.name === 'SUPER_ADMIN') {
            permissions.add('*'); // Super Admin wildcard bypass
          }

          for (const rolePerm of role.permissions) {
            const p = rolePerm.permission;
            const code = `${p.module.toLowerCase()}.${p.resource.toLowerCase()}.${p.action.toLowerCase()}`;
            permissions.add(code);
            // Also add simplified resource.action (e.g., student.read)
            permissions.add(`${p.resource.toLowerCase()}.${p.action.toLowerCase()}`);
          }
        }

        return Array.from(permissions);
      },
      600, // 10 minutes cache
      ['rbac', `user:${userId}`],
    );
  }

  async getRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
        _count: { select: { users: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { resource: 'asc' }],
    });
  }

  async createRole(name: string, description?: string) {
    return this.prisma.role.create({
      data: {
        name: name.toUpperCase().replace(/\s+/g, '_'),
        description,
        isSystem: false,
      },
    });
  }

  async assignRoleToUser(userId: string, roleName: string) {
    const role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) throw new NotFoundException(`Role "${roleName}" not found`);

    const userRole = await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId,
        roleId: role.id,
      },
    });

    await this.cacheService.evictByTag(`user:${userId}`);
    return userRole;
  }

  async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    // Wipe and re-assign
    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    const rolePermissions = await this.prisma.rolePermission.createMany({
      data: permissionIds.map((pId) => ({
        roleId,
        permissionId: pId,
      })),
      skipDuplicates: true,
    });

    // Invalidate entire RBAC cache
    await this.cacheService.evictByTag('rbac');
    return rolePermissions;
  }
}
