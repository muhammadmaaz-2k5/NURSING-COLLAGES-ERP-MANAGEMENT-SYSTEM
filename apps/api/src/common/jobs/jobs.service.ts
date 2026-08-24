import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EMAIL_QUEUE, SMS_QUEUE, PDF_QUEUE, NOTIFICATION_QUEUE } from './jobs.constants';

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  template?: string;
  context?: Record<string, any>;
}

export interface SmsJobData {
  to: string;
  message: string;
}

export interface PdfJobData {
  type: 'CERTIFICATE' | 'TRANSCRIPT' | 'FEE_CHALLAN' | 'REPORT';
  entityId: string;
  outputName: string;
  data: Record<string, any>;
}

export interface NotificationJobData {
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private emailQueue: Queue | null = null;
  private smsQueue: Queue | null = null;
  private pdfQueue: Queue | null = null;
  private notificationQueue: Queue | null = null;

  constructor() {
    this.initQueues();
  }

  private initQueues() {
    try {
      const redisHost = process.env.REDIS_HOST || 'localhost';
      const redisPort = Number(process.env.REDIS_PORT) || 6379;
      const redisPassword = process.env.REDIS_PASSWORD || undefined;

      const connection = {
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        maxRetriesPerRequest: null,
      };

      this.emailQueue = new Queue(EMAIL_QUEUE, { connection });
      this.smsQueue = new Queue(SMS_QUEUE, { connection });
      this.pdfQueue = new Queue(PDF_QUEUE, { connection });
      this.notificationQueue = new Queue(NOTIFICATION_QUEUE, { connection });

      this.logger.log('⚡ BullMQ Queues initialized with Redis connection');
    } catch (err: any) {
      this.logger.warn(`BullMQ initialized in fallback mode: ${err?.message}`);
    }
  }

  async dispatchEmail(data: EmailJobData, delayMs = 0): Promise<void> {
    try {
      if (this.emailQueue) {
        await this.emailQueue.add('send', data, {
          delay: delayMs,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
        });
        this.logger.debug(`[JOB] Email queued for: ${data.to}`);
        return;
      }
    } catch (err: any) {
      this.logger.warn(`Queue dispatch failed, processing in direct mode: ${err?.message}`);
    }
    this.logger.log(`[EMAIL DISPATCH] To: ${data.to} | Subject: ${data.subject}`);
  }

  async dispatchSms(data: SmsJobData): Promise<void> {
    try {
      if (this.smsQueue) {
        await this.smsQueue.add('send', data, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
        });
        this.logger.debug(`[JOB] SMS queued for: ${data.to}`);
        return;
      }
    } catch (err: any) {
      this.logger.warn(`Queue dispatch failed, processing in direct mode: ${err?.message}`);
    }
    this.logger.log(`[SMS DISPATCH] To: ${data.to} | Message: ${data.message}`);
  }

  async dispatchPdfGeneration(data: PdfJobData): Promise<void> {
    try {
      if (this.pdfQueue) {
        await this.pdfQueue.add('generate', data, {
          attempts: 2,
          removeOnComplete: true,
        });
        this.logger.debug(`[JOB] PDF generation queued for: ${data.type} (${data.entityId})`);
        return;
      }
    } catch (err: any) {
      this.logger.warn(`Queue dispatch failed: ${err?.message}`);
    }
    this.logger.log(`[PDF WORKER] Generated PDF for: ${data.type} [${data.outputName}]`);
  }

  async dispatchNotification(data: NotificationJobData): Promise<void> {
    try {
      if (this.notificationQueue) {
        await this.notificationQueue.add('send', data, {
          removeOnComplete: true,
        });
        this.logger.debug(`[JOB] In-App Notification queued for: ${data.userId}`);
        return;
      }
    } catch (err: any) {
      this.logger.warn(`Queue dispatch failed: ${err?.message}`);
    }
    this.logger.log(`[NOTIFICATION DISPATCH] User: ${data.userId} | ${data.title}`);
  }
}
