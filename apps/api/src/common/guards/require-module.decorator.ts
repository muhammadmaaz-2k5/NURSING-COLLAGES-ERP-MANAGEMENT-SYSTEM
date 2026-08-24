import { SetMetadata } from '@nestjs/common';
import { ModuleType } from '@prisma/client';

export const REQUIRE_MODULE_KEY = 'REQUIRE_MODULE_KEY';

/**
 * Guard decorator that restricts access to endpoints if the module is disabled for this college instance.
 *
 * @example
 * ```ts
 * @RequireModule(ModuleType.HOSPITAL)
 * @Controller('hospital')
 * export class HospitalController { ... }
 * ```
 */
export const RequireModule = (module: ModuleType) => SetMetadata(REQUIRE_MODULE_KEY, module);
