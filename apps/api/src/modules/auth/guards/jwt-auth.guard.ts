import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CacheService } from '../../../common/cache';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly cacheService: CacheService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isValid = (await super.canActivate(context)) as boolean;
    if (!isValid) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid user session');
    }

    // Check if token JTI is blacklisted (e.g. after logout)
    if (user.jti) {
      const isBlacklisted = await this.cacheService.get(`token:blacklist:${user.jti}`);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked. Please log in again.');
      }
    }

    return true;
  }
}
