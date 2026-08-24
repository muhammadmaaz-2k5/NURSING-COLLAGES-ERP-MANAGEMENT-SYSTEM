import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NOTIFICATION_QUEUE } from '../jobs.constants';
import { NotificationJobData } from '../jobs.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<NotificationJobData>): Promise<any> {
    const { userId, title, message, type, link } = job.data;
    this.logger.log(`🔔 [BullMQ Worker] Persisting notification for user ${userId}: "${title}"`);

    try {
      const created = await this.prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type: (type as NotificationType) || NotificationType.GENERAL,
          link,
        },
      });
      return created;
    } catch (err: any) {
      this.logger.error(`Failed to persist in-app notification: ${err?.message}`);
      throw err;
    }
  }
}
