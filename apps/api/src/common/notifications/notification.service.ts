import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { NotificationType, NotificationStatus } from '@prisma/client';
import { createPaginatedResult, PaginatedResult } from '../interfaces/pagination.interface';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
  ) {}

  /**
   * Dispatch an asynchronous in-app notification via BullMQ
   */
  async notify(userId: string, title: string, message: string, type = NotificationType.GENERAL, link?: string) {
    await this.jobsService.dispatchNotification({
      userId,
      title,
      message,
      type,
      link,
    });
  }

  /**
   * Dispatch an asynchronous email via BullMQ
   */
  async sendEmail(to: string, subject: string, body: string) {
    await this.jobsService.dispatchEmail({ to, subject, body });
  }

  /**
   * Dispatch an asynchronous SMS via BullMQ
   */
  async sendSms(to: string, message: string) {
    await this.jobsService.dispatchSms({ to, message });
  }

  /**
   * Retrieve in-app notifications for a user
   */
  async getUserNotifications(
    userId: string,
    status?: NotificationStatus,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<any>> {
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (status) where.status = status;

    const [total, data] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, status: NotificationStatus.UNREAD },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });
  }
}
