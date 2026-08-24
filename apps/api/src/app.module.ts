import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './common/cache/cache.module';
import { StorageModule } from './common/storage/storage.module';
import { AuditModule } from './common/audit/audit.module';
import { DatabaseModule } from './common/database/database.module';
import { JobsModule } from './common/jobs/jobs.module';
import { NotificationModule } from './common/notifications/notification.module';
import { validateEnvironment } from './common/env/env.validation';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { InstanceBootstrapService } from './common/bootstrap/instance-bootstrap.service';

import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { CollegeModule } from './modules/college/college.module';
import { ModuleConfigModule } from './modules/module-config/module-config.module';
import { AcademicModule } from './modules/academic/academic.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { StudentsModule } from './modules/students/students.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ExamsModule } from './modules/exams/exams.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ClinicalModule } from './modules/clinical/clinical.module';
import { HospitalModule } from './modules/hospital/hospital.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { FacilitiesModule } from './modules/facilities/facilities.module';
import { HrModule } from './modules/hr/hr.module';
import { PortalModule } from './modules/portal/portal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      validate: validateEnvironment,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 120, // 120 requests per minute
      },
    ]),
    CacheModule.forRootAsync(),
    StorageModule,
    AuditModule,
    DatabaseModule,
    JobsModule,
    NotificationModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    CollegeModule,
    ModuleConfigModule,
    AcademicModule,
    AdmissionsModule,
    StudentsModule,
    FacultyModule,
    AttendanceModule,
    ExamsModule,
    FinanceModule,
    ClinicalModule,
    HospitalModule,
    PharmacyModule,
    FacilitiesModule,
    HrModule,
    PortalModule,
  ],
  providers: [
    InstanceBootstrapService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
