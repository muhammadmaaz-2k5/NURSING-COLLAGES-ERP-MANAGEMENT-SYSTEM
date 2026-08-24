import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RbacService } from '../rbac/rbac.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permission requirement
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.id) {
      throw new ForbiddenException('Access Denied: Unauthenticated or invalid token context');
    }

    // Resolve user's permissions from cache/db
    const userPermissions = await this.rbacService.getUserPermissions(user.id);

    // Wildcard Super Admin check
    if (userPermissions.includes('*')) {
      return true;
    }

    // Check if user has ALL required permissions
    const hasAll = requiredPermissions.every((required) =>
      userPermissions.includes(required.toLowerCase()),
    );

    if (!hasAll) {
      const missing = requiredPermissions.filter(
        (r) => !userPermissions.includes(r.toLowerCase()),
      );
      throw new ForbiddenException(
        `Access Denied: You lack required permission(s): [${missing.join(', ')}]`,
      );
    }

    return true;
  }
}
