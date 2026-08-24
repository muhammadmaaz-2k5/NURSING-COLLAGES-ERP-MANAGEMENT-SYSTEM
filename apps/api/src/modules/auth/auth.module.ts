import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RbacService } from './rbac/rbac.service';
import { RbacBootstrapService } from './rbac/rbac-bootstrap.service';
import { RbacController } from './rbac/rbac.controller';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'super-secret-jwt-key-for-development-change-in-production'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN', '15m')) as any,
        },
      }),
    }),
  ],
  controllers: [AuthController, RbacController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    RbacService,
    RbacBootstrapService,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    RbacService,
    PassportModule,
  ],
})
export class AuthModule {}
