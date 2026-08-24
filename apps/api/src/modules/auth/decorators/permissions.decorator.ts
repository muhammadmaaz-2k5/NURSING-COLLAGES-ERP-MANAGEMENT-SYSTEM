import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'PERMISSIONS_KEY';

/**
 * Decorator to require one or more granular permissions on an endpoint or controller.
 *
 * @example
 * ```ts
 * @RequirePermissions('student.create', 'student.update')
 * @Post()
 * createStudent() { ... }
 * ```
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// Alias
export const Permissions = RequirePermissions;
