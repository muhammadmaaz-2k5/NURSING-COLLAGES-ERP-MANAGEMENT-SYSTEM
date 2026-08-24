import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache';
import { RbacService } from './rbac/rbac.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserStatus } from '@prisma/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 900; // 15 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly rbacService: RbacService,
  ) {}

  /**
   * Validate user credentials with brute-force lockout defense
   */
  async validateUser(email: string, pass: string) {
    const lockKey = `failed_login:${email.toLowerCase()}`;
    const failedCount = (await this.cacheService.get<number>(lockKey)) || 0;

    if (failedCount >= this.MAX_FAILED_ATTEMPTS) {
      throw new ForbiddenException(
        'Account temporarily locked due to excessive failed login attempts. Please try again in 15 minutes.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      await this.recordFailedAttempt(email, failedCount);
      return null;
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(`Account is ${user.status.toLowerCase()}. Access denied.`);
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      await this.recordFailedAttempt(email, failedCount);
      return null;
    }

    // Reset failed counter on success
    await this.cacheService.del(lockKey);

    // Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { passwordHash, ...result } = user;
    return result;
  }

  private async recordFailedAttempt(email: string, currentCount: number) {
    const lockKey = `failed_login:${email.toLowerCase()}`;
    await this.cacheService.set(lockKey, currentCount + 1, this.LOCKOUT_DURATION);
  }

  /**
   * Issue dual tokens (Access Token 15m + Refresh Token 7d) with cryptographic rotation
   */
  async generateTokens(user: any): Promise<AuthTokens> {
    const jti = uuidv4();
    const refreshJti = uuidv4();
    const roles = user.roles?.map((r: any) => r.role?.name || r.name || r) || [];

    const accessPayload = {
      sub: user.id,
      email: user.email,
      roles,
      jti,
    };

    const refreshPayload = {
      sub: user.id,
      email: user.email,
      jti: refreshJti,
    };

    const accessToken = this.jwtService.sign(accessPayload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: '7d' });

    // Store refresh token JTI in cache for 7 days
    await this.cacheService.set(
      `refresh_token:${user.id}:${refreshJti}`,
      { valid: true, createdAt: Date.now() },
      604800, // 7 days
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes (seconds)
    };
  }

  async login(user: any) {
    const tokens = await this.generateTokens(user);
    const permissions = await this.rbacService.getUserPermissions(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles?.map((r: any) => r.role?.name || r.name || r) || [],
        permissions,
      },
    };
  }

  /**
   * Refresh Token Rotation: Invalidate old refresh token and issue fresh token pair
   */
  async refreshTokens(oldRefreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(oldRefreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userId = payload.sub;
    const jti = payload.jti;
    const tokenRecordKey = `refresh_token:${userId}:${jti}`;

    const isValid = await this.cacheService.get(tokenRecordKey);
    if (!isValid) {
      // Possible token replay attack -> Invalidate all refresh tokens for this user
      await this.cacheService.evictPattern(`refresh_token:${userId}:*`);
      throw new UnauthorizedException('Revoked refresh token presented. Security alert: session terminated.');
    }

    // Invalidate old refresh token (Rotation)
    await this.cacheService.del(tokenRecordKey);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is invalid or suspended');
    }

    return this.generateTokens(user);
  }

  /**
   * Revoke active refresh token and blacklist access token JTI
   */
  async logout(userId: string, accessJti?: string, refreshJti?: string) {
    if (accessJti) {
      // Blacklist access token for 15 minutes
      await this.cacheService.set(`token:blacklist:${accessJti}`, true, 900);
    }
    if (refreshJti) {
      await this.cacheService.del(`refresh_token:${userId}:${refreshJti}`);
    } else {
      // Invalidate all refresh sessions for this user
      await this.cacheService.evictPattern(`refresh_token:${userId}:*`);
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
      include: {
        roles: { include: { role: true } },
      },
    });

    return this.login(user);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        student: { include: { program: true } },
        faculty: { include: { department: true } },
        employee: { include: { department: true } },
      },
    });

    if (!user) throw new UnauthorizedException('User not found');
    const permissions = await this.rbacService.getUserPermissions(userId);
    const { passwordHash, ...safeUser } = user;

    return {
      ...safeUser,
      permissions,
    };
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(oldPass, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Invalidate all existing sessions
    await this.cacheService.evictPattern(`refresh_token:${userId}:*`);

    return { success: true, message: 'Password updated successfully. Please log in again.' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      // Don't leak user existence
      return { success: true, message: 'If the email exists, a password reset link has been dispatched.' };
    }

    const resetToken = uuidv4();
    await this.cacheService.set(`pwd_reset:${resetToken}`, user.id, 3600); // 1 hour

    return {
      success: true,
      message: 'Password reset token generated (in production dispatched via email/SMS).',
      resetToken, // Returned for dev testing convenience
    };
  }

  async resetPassword(resetToken: string, newPass: string) {
    const userId = await this.cacheService.get<string>(`pwd_reset:${resetToken}`);
    if (!userId) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const newHash = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    await this.cacheService.del(`pwd_reset:${resetToken}`);
    await this.cacheService.evictPattern(`refresh_token:${userId}:*`);

    return { success: true, message: 'Password has been reset successfully.' };
  }
}
