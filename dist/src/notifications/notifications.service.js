"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
const websocket_gateway_1 = require("../common/websocket.gateway");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    configService;
    webSocketGateway;
    logger = new common_1.Logger(NotificationsService_1.name);
    transporter;
    constructor(configService, webSocketGateway) {
        this.configService = configService;
        this.webSocketGateway = webSocketGateway;
        this.initializeEmailTransporter();
    }
    initializeEmailTransporter() {
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
    notifications = new Map();
    async sendEmail(options) {
        try {
            const mailOptions = {
                from: this.configService.get('EMAIL_FROM') ||
                    this.configService.get('EMAIL_USER'),
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html ||
                    this.generateEmailHTML(options.subject, options.text || ''),
            };
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to ${options.to}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}:`, error);
            return false;
        }
    }
    generateEmailHTML(subject, content) {
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
    async createNotification(notificationData) {
        const notification = {
            ...notificationData,
            read: false,
            createdAt: new Date(),
        };
        const userNotifications = this.notifications.get(notificationData.userId) || [];
        userNotifications.unshift(notification);
        if (userNotifications.length > 100) {
            userNotifications.splice(100);
        }
        this.notifications.set(notificationData.userId, userNotifications);
        if (this.webSocketGateway &&
            this.webSocketGateway.isUserConnected(notificationData.userId)) {
            this.webSocketGateway.emitNotification(notificationData.userId, notification);
        }
        this.logger.log(`Notification created for user ${notificationData.userId}: ${notificationData.title}`);
        return notification;
    }
    async getUserNotifications(userId, limit = 20, offset = 0) {
        const userNotifications = this.notifications.get(userId) || [];
        return userNotifications.slice(offset, offset + limit);
    }
    async markAsRead(userId, notificationIndex) {
        const userNotifications = this.notifications.get(userId);
        if (userNotifications && userNotifications[notificationIndex]) {
            userNotifications[notificationIndex].read = true;
            return true;
        }
        return false;
    }
    async markAllAsRead(userId) {
        const userNotifications = this.notifications.get(userId);
        if (userNotifications) {
            userNotifications.forEach((notification) => (notification.read = true));
            return true;
        }
        return false;
    }
    async getUnreadCount(userId) {
        const userNotifications = this.notifications.get(userId) || [];
        return userNotifications.filter((notification) => !notification.read)
            .length;
    }
    async deleteNotification(userId, notificationIndex) {
        const userNotifications = this.notifications.get(userId);
        if (userNotifications && userNotifications[notificationIndex]) {
            userNotifications.splice(notificationIndex, 1);
            return true;
        }
        return false;
    }
    async clearAllNotifications(userId) {
        this.notifications.delete(userId);
        return true;
    }
    async sendWelcomeEmail(userEmail, userName) {
        return this.sendEmail({
            to: userEmail,
            subject: 'Welcome to Harmonia!',
            html: this.generateEmailHTML('Welcome to Harmonia!', `Hello ${userName}! Welcome to Harmonia, your new favorite music streaming platform. Start exploring millions of songs today!`),
        });
    }
    async sendPasswordResetEmail(userEmail, resetToken) {
        const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
        return this.sendEmail({
            to: userEmail,
            subject: 'Password Reset Request',
            html: this.generateEmailHTML('Password Reset Request', `You requested a password reset. Click the link below to reset your password: <a href="${resetUrl}">Reset Password</a>. This link expires in 1 hour.`),
        });
    }
    async sendSubscriptionNotification(userEmail, subscriptionType, isUpgrade) {
        const action = isUpgrade ? 'upgraded to' : 'subscribed to';
        return this.sendEmail({
            to: userEmail,
            subject: `Subscription ${isUpgrade ? 'Upgraded' : 'Activated'}`,
            html: this.generateEmailHTML(`Subscription ${isUpgrade ? 'Upgraded' : 'Activated'}`, `You have successfully ${action} ${subscriptionType}. Enjoy your enhanced music experience!`),
        });
    }
    async sendPlaylistSharedNotification(userEmail, playlistName, sharedBy) {
        return this.sendEmail({
            to: userEmail,
            subject: 'New Playlist Shared With You',
            html: this.generateEmailHTML('New Playlist Shared With You', `${sharedBy} has shared a playlist "${playlistName}" with you. Check it out on Harmonia!`),
        });
    }
    async sendNewReleaseNotification(userEmail, artistName, albumName) {
        return this.sendEmail({
            to: userEmail,
            subject: 'New Release from Your Favorite Artist',
            html: this.generateEmailHTML('New Release Alert', `${artistName} just released a new album "${albumName}". Listen now on Harmonia!`),
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => websocket_gateway_1.WebSocketGateway))),
    __metadata("design:paramtypes", [config_1.ConfigService,
        websocket_gateway_1.WebSocketGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map