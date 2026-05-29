import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateNotificationDto, BulkNotificationDto,
  CreateTemplateDto, UpdateTemplateDto,
} from './dto/notification.dto';
import { NotificationChannel, NotificationStatus, Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ── IN-APP NOTIFICATIONS ──────────────────────────────────────────

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        body: dto.body,
        type: dto.type ?? 'GENERAL',
        channel: dto.channel ?? 'IN_APP',
        data: dto.data as Prisma.InputJsonValue | undefined,
        imageUrl: dto.imageUrl,
        actionUrl: dto.actionUrl,
      },
    });

    await this.prisma.notificationLog.create({
      data: {
        notificationId: notification.id,
        channel: dto.channel ?? 'IN_APP',
        status: 'SENT',
        recipient: dto.userId,
        sentAt: new Date(),
      },
    });

    this.logger.log(`Notification created: ${notification.id} for user ${dto.userId}`);
    return notification;
  }

  async bulkCreate(dto: BulkNotificationDto) {
    const notifications = await Promise.all(
      dto.userIds.map((userId) =>
        this.create({
          userId,
          title: dto.title,
          body: dto.body,
          type: dto.type,
          channel: dto.channel,
          data: dto.data,
        }),
      ),
    );
    return { sent: notifications.length, notifications };
  }

  async findUserNotifications(
    userId: string,
    page = 1,
    limit = 20,
    unreadOnly = false,
  ) {
    const skip = (page - 1) * limit;
    const where = { userId, ...(unreadOnly ? { isRead: false } : {}) };

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      notifications,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      unreadCount,
    };
  }

  async markAsRead(userId: string, ids?: string[]) {
    const where = ids?.length
      ? { userId, id: { in: ids } }
      : { userId, isRead: false };

    const result = await this.prisma.notification.updateMany({
      where,
      data: { isRead: true, readAt: new Date() },
    });

    return { updated: result.count };
  }

  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { updated: result.count };
  }

  async deleteNotification(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    await this.prisma.notification.delete({ where: { id } });
    return { deleted: true };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount: count };
  }

  // ── TEMPLATES ─────────────────────────────────────────────────────

  async createTemplate(dto: CreateTemplateDto) {
    return this.prisma.notificationTemplate.create({
      data: {
        name: dto.name,
        type: dto.type,
        channel: dto.channel,
        titleTemplate: dto.titleTemplate,
        bodyTemplate: dto.bodyTemplate,
        variables: dto.variables ?? [],
      },
    });
  }

  async findAllTemplates() {
    return this.prisma.notificationTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTemplate(id: string, dto: UpdateTemplateDto) {
    return this.prisma.notificationTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTemplate(id: string) {
    await this.prisma.notificationTemplate.delete({ where: { id } });
    return { deleted: true };
  }

  async sendFromTemplate(
    templateName: string,
    userId: string,
    variables: Record<string, string> = {},
  ) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { name: templateName, isActive: true },
    });
    if (!template) throw new NotFoundException(`Template '${templateName}' not found`);

    const interpolate = (str: string) =>
      str.replace(/\{\{(\w+)\}\}/g, (_, k) => variables[k] ?? `{{${k}}}`);

    return this.create({
      userId,
      title: interpolate(template.titleTemplate),
      body: interpolate(template.bodyTemplate),
      type: template.type,
      channel: template.channel,
    });
  }

  // ── ADMIN: NOTIFICATION LOGS ──────────────────────────────────────

  async getNotificationLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.notificationLog.findMany({
        skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          notification: { select: { title: true, type: true, userId: true } },
        },
      }),
      this.prisma.notificationLog.count(),
    ]);
    return { logs, pagination: { total, page, limit } };
  }

  async getNotificationStats() {
    const [total, sent, delivered, failed, byChannel, byType] = await Promise.all([
      this.prisma.notification.count(),
      this.prisma.notificationLog.count({ where: { status: 'SENT' } }),
      this.prisma.notificationLog.count({ where: { status: 'DELIVERED' } }),
      this.prisma.notificationLog.count({ where: { status: 'FAILED' } }),
      this.prisma.notificationLog.groupBy({
        by: ['channel'],
        _count: { id: true },
      }),
      this.prisma.notification.groupBy({
        by: ['type'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ]);

    return {
      total,
      sent, delivered, failed,
      byChannel: byChannel.map((r) => ({ channel: r.channel, count: r._count.id })),
      byType: byType.map((r) => ({ type: r.type, count: r._count.id })),
    };
  }
}
