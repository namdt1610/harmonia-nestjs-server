import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  NotificationsService,
  NotificationData,
} from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateNotificationDto {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: any;
}

class SendEmailDto {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  async getUserNotifications(
    @Request() req,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    const notifications = await this.notificationsService.getUserNotifications(
      req.user.sub,
      Number(limit),
      Number(offset),
    );

    return {
      success: true,
      data: notifications,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        hasMore: notifications.length === Number(limit),
      },
    };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.sub);
    return {
      success: true,
      data: { unreadCount: count },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
  })
  async createNotification(
    @Request() req,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const notificationData: NotificationData = {
      userId: req.user.sub,
      ...createNotificationDto,
    };

    const notification =
      await this.notificationsService.createNotification(notificationData);

    return {
      success: true,
      data: notification,
      message: 'Notification created successfully',
    };
  }

  @Put(':index/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(@Request() req, @Param('index') index: string) {
    const success = await this.notificationsService.markAsRead(
      req.user.sub,
      parseInt(index),
    );

    return {
      success,
      message: success
        ? 'Notification marked as read'
        : 'Notification not found',
    };
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Request() req) {
    const success = await this.notificationsService.markAllAsRead(req.user.sub);

    return {
      success,
      message: 'All notifications marked as read',
    };
  }

  @Delete(':index')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  async deleteNotification(@Request() req, @Param('index') index: string) {
    const success = await this.notificationsService.deleteNotification(
      req.user.sub,
      parseInt(index),
    );

    return {
      success,
      message: success
        ? 'Notification deleted successfully'
        : 'Notification not found',
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all notifications' })
  @ApiResponse({ status: 200, description: 'All notifications cleared' })
  async clearAllNotifications(@Request() req) {
    const success = await this.notificationsService.clearAllNotifications(
      req.user.sub,
    );

    return {
      success,
      message: 'All notifications cleared',
    };
  }

  @Post('send-email')
  @ApiOperation({ summary: 'Send email notification' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const success = await this.notificationsService.sendEmail(sendEmailDto);

    return {
      success,
      message: success ? 'Email sent successfully' : 'Failed to send email',
    };
  }

  @Post('test/welcome-email')
  @ApiOperation({ summary: 'Send test welcome email' })
  @ApiResponse({ status: 200, description: 'Welcome email sent' })
  async sendTestWelcomeEmail(@Request() req) {
    // This would typically get user email from the database
    const userEmail = req.user.email || 'test@example.com';
    const userName = req.user.name || 'Test User';

    const success = await this.notificationsService.sendWelcomeEmail(
      userEmail,
      userName,
    );

    return {
      success,
      message: success
        ? 'Welcome email sent successfully'
        : 'Failed to send welcome email',
    };
  }

  @Post('test/reset-password')
  @ApiOperation({ summary: 'Send test password reset email' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async sendTestPasswordResetEmail(@Request() req) {
    const userEmail = req.user.email || 'test@example.com';
    const resetToken = 'test-reset-token-' + Date.now();

    const success = await this.notificationsService.sendPasswordResetEmail(
      userEmail,
      resetToken,
    );

    return {
      success,
      message: success
        ? 'Password reset email sent successfully'
        : 'Failed to send password reset email',
    };
  }
}
