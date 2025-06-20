import {
  Injectable,
  Logger,
  Inject,
  forwardRef,
  Optional,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { WebSocketGateway as WSGateway } from '../common/websocket.gateway';

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: any;
  read?: boolean;
  createdAt?: Date;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  templateData?: any;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    @Optional()
    @Inject(forwardRef(() => WSGateway))
    private webSocketGateway?: WSGateway,
  ) {
    this.initializeEmailTransporter();
  }

  private initializeEmailTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: this.configService.get('EMAIL_SECURE', 'false') === 'true',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  // In-memory notification storage (in production, use a database)
  private notifications: Map<string, NotificationData[]> = new Map();

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from:
          this.configService.get('EMAIL_FROM') ||
          this.configService.get('EMAIL_USER'),
        to: options.to,
        subject: options.subject,
        text: options.text,
        html:
          options.html ||
          this.generateEmailHTML(options.subject, options.text || ''),
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  private generateEmailHTML(subject: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f4f4f4; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Harmonia</h1>
            </div>
            <div class="content">
              <h2>${subject}</h2>
              <p>${content}</p>
            </div>
            <div class="footer">
              <p>© 2024 Harmonia Music Streaming Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async createNotification(
    notificationData: NotificationData,
  ): Promise<NotificationData> {
    const notification: NotificationData = {
      ...notificationData,
      read: false,
      createdAt: new Date(),
    };

    // Store notification
    const userNotifications =
      this.notifications.get(notificationData.userId) || [];
    userNotifications.unshift(notification);

    // Keep only the latest 100 notifications per user
    if (userNotifications.length > 100) {
      userNotifications.splice(100);
    }

    this.notifications.set(notificationData.userId, userNotifications);

    // Send real-time notification via WebSocket
    if (
      this.webSocketGateway &&
      this.webSocketGateway.isUserConnected(notificationData.userId)
    ) {
      this.webSocketGateway.emitNotification(
        notificationData.userId,
        notification,
      );
    }

    this.logger.log(
      `Notification created for user ${notificationData.userId}: ${notificationData.title}`,
    );
    return notification;
  }

  async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<NotificationData[]> {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.slice(offset, offset + limit);
  }

  async markAsRead(
    userId: string,
    notificationIndex: number,
  ): Promise<boolean> {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications && userNotifications[notificationIndex]) {
      userNotifications[notificationIndex].read = true;
      return true;
    }
    return false;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      userNotifications.forEach((notification) => (notification.read = true));
      return true;
    }
    return false;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter((notification) => !notification.read)
      .length;
  }

  async deleteNotification(
    userId: string,
    notificationIndex: number,
  ): Promise<boolean> {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications && userNotifications[notificationIndex]) {
      userNotifications.splice(notificationIndex, 1);
      return true;
    }
    return false;
  }

  async clearAllNotifications(userId: string): Promise<boolean> {
    this.notifications.delete(userId);
    return true;
  }

  // Email templates for common notifications
  async sendWelcomeEmail(
    userEmail: string,
    userName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to Harmonia!',
      html: this.generateEmailHTML(
        'Welcome to Harmonia!',
        `Hello ${userName}! Welcome to Harmonia, your new favorite music streaming platform. Start exploring millions of songs today!`,
      ),
    });
  }

  async sendPasswordResetEmail(
    userEmail: string,
    resetToken: string,
  ): Promise<boolean> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    return this.sendEmail({
      to: userEmail,
      subject: 'Password Reset Request',
      html: this.generateEmailHTML(
        'Password Reset Request',
        `You requested a password reset. Click the link below to reset your password: <a href="${resetUrl}">Reset Password</a>. This link expires in 1 hour.`,
      ),
    });
  }

  async sendSubscriptionNotification(
    userEmail: string,
    subscriptionType: string,
    isUpgrade: boolean,
  ): Promise<boolean> {
    const action = isUpgrade ? 'upgraded to' : 'subscribed to';
    return this.sendEmail({
      to: userEmail,
      subject: `Subscription ${isUpgrade ? 'Upgraded' : 'Activated'}`,
      html: this.generateEmailHTML(
        `Subscription ${isUpgrade ? 'Upgraded' : 'Activated'}`,
        `You have successfully ${action} ${subscriptionType}. Enjoy your enhanced music experience!`,
      ),
    });
  }

  async sendPlaylistSharedNotification(
    userEmail: string,
    playlistName: string,
    sharedBy: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: 'New Playlist Shared With You',
      html: this.generateEmailHTML(
        'New Playlist Shared With You',
        `${sharedBy} has shared a playlist "${playlistName}" with you. Check it out on Harmonia!`,
      ),
    });
  }

  async sendNewReleaseNotification(
    userEmail: string,
    artistName: string,
    albumName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: 'New Release from Your Favorite Artist',
      html: this.generateEmailHTML(
        'New Release Alert',
        `${artistName} just released a new album "${albumName}". Listen now on Harmonia!`,
      ),
    });
  }
}
