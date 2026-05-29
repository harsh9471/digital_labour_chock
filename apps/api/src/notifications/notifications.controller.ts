import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe,
  DefaultValuePipe, ParseBoolPipe,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import {
  CreateNotificationDto, BulkNotificationDto,
  CreateTemplateDto, UpdateTemplateDto, MarkReadDto,
} from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  // ── User endpoints ───────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  getMyNotifications(
    @CurrentUser() user: JwtPayload,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('unread', new DefaultValuePipe(false), ParseBoolPipe) unread: boolean,
  ) {
    return this.svc.findUserNotifications(user.sub, page, limit, unread);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@CurrentUser() user: JwtPayload) {
    return this.svc.getUnreadCount(user.sub);
  }

  @Patch('mark-read')
  @ApiOperation({ summary: 'Mark notifications as read' })
  markRead(@CurrentUser() user: JwtPayload, @Body() dto: MarkReadDto) {
    return this.svc.markAsRead(user.sub, dto.ids);
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser() user: JwtPayload) {
    return this.svc.markAllRead(user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  deleteNotification(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.svc.deleteNotification(user.sub, id);
  }

  // ── Admin endpoints ──────────────────────────────────────────────

  @Post('send')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Send a notification (admin)' })
  send(@Body() dto: CreateNotificationDto) {
    return this.svc.create(dto);
  }

  @Post('bulk')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Send bulk notifications (admin)' })
  bulkSend(@Body() dto: BulkNotificationDto) {
    return this.svc.bulkCreate(dto);
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Notification statistics (admin)' })
  getStats() {
    return this.svc.getNotificationStats();
  }

  @Get('admin/logs')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Notification delivery logs (admin)' })
  getLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.svc.getNotificationLogs(page, limit);
  }

  // ── Template endpoints ───────────────────────────────────────────

  @Get('templates')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List notification templates' })
  listTemplates() {
    return this.svc.findAllTemplates();
  }

  @Post('templates')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create notification template' })
  createTemplate(@Body() dto: CreateTemplateDto) {
    return this.svc.createTemplate(dto);
  }

  @Patch('templates/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update notification template' })
  updateTemplate(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return this.svc.updateTemplate(id, dto);
  }

  @Delete('templates/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete notification template' })
  deleteTemplate(@Param('id') id: string) {
    return this.svc.deleteTemplate(id);
  }
}
