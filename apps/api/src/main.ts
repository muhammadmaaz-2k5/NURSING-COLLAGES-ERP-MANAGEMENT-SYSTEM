import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Enable Graceful Shutdown for SIGINT & SIGTERM
  app.enableShutdownHooks();

  // Global prefix
  const globalPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);

  // CORS configuration
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global exception filter for unified problem details & Prisma mapping
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global structured logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger / OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('PERN Nursing & Healthcare Colleges ERP Management System')
    .setDescription(
      'Enterprise Production Single-Tenant College Management System API: Dedicated Single Database per College, Dynamic Module Guards, Security Helmet, Throttler, Caching with Mutex, RBAC, Academic Curriculum, Students, Faculty, Biometric Attendance, Exams & Result Cards, Finance & Challans, Nursing Clinical Rotations, Hospital Wards & Beds, Pharmacy, Facilities, HR Payroll, and Public Portal.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Health & Status')
    .addTag('Authentication & RBAC')
    .addTag('College Settings & Profile')
    .addTag('Module Configurations (SaaS Features)')
    .addTag('Academic Management')
    .addTag('Admissions & Applications')
    .addTag('Students Management')
    .addTag('Faculty & Instructors')
    .addTag('Attendance Management')
    .addTag('Examinations & Results')
    .addTag('Fees & Financial Management')
    .addTag('Clinical Rotations & Nursing Skills')
    .addTag('Hospital, OPD, IPD & Clinic Management')
    .addTag('Pharmacy & Medicine Dispensary')
    .addTag('Campus Facilities (Hostel, Library, Transport)')
    .addTag('Human Resources & Payroll')
    .addTag('Public Portal, Announcements & Certificates')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 NestJS Production API server running on: http://localhost:${port}/${globalPrefix}`);
  logger.log(`📚 Swagger documentation available at: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
