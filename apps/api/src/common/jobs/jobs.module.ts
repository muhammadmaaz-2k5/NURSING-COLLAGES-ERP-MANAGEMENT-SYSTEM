import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobsService } from './jobs.service';
import { EMAIL_QUEUE, SMS_QUEUE, PDF_QUEUE, NOTIFICATION_QUEUE } from './jobs.constants';
import { EmailProcessor } from './processors/email.processor';
import { PdfProcessor } from './processors/pdf.processor';
import { NotificationProcessor } from './processors/notification.processor';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          maxRetriesPerRequest: null,
        },
      }),
    }),
    BullModule.registerQueue(
      { name: EMAIL_QUEUE },
      { name: SMS_QUEUE },
      { name: PDF_QUEUE },
      { name: NOTIFICATION_QUEUE },
    ),
  ],
  providers: [
    JobsService,
    EmailProcessor,
    PdfProcessor,
    NotificationProcessor,
  ],
  exports: [JobsService, BullModule],
})
export class JobsModule {}
