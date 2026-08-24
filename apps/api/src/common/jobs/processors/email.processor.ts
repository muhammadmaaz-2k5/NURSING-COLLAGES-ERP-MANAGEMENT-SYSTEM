import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EMAIL_QUEUE } from '../jobs.constants';
import { EmailJobData } from '../jobs.service';

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<EmailJobData>): Promise<any> {
    const { to, subject, body } = job.data;
    this.logger.log(`📧 [BullMQ Worker] Processing email delivery to: ${to} (Subject: ${subject})`);

    // In production, integrate with SendGrid, AWS SES, or SMTP
    await new Promise((res) => setTimeout(res, 50));

    this.logger.log(`✅ [BullMQ Worker] Email successfully delivered to: ${to}`);
    return { delivered: true, timestamp: new Date().toISOString() };
  }
}
